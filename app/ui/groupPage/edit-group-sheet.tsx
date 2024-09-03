'use client'
import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateGroup } from '@/app/lib/action';
import { fetchGroupData } from '@/app/lib/data';

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Grup adınız en az 2 harften oluşmalıdır' }),
  description: z.string(),
  fields: z.array(
    z.object({
        id: z.string().nullable(),
      field_name: z.string().min(1, { message: 'Alan adı gereklidir' }),
      field_location: z.string().min(1, { message: 'Alan konumu gereklidir' }),
    })
  ).min(1, { message: 'En az bir alan gereklidir' }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function EditGroup({ groupId }: { groupId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      fields: [{ field_name: '', field_location: '' }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  useEffect(() => {
    async function loadGroupData() {
      try {
        const data = await fetchGroupData(groupId);
        form.reset(data);
        setIsLoading(false);
      } catch (err) {
        setError('Grup verisi yüklenemedi');
        setIsLoading(false);
      }
    }

    if (isOpen) {
      setIsLoading(true);
      loadGroupData();
    }
  }, [groupId, form, isOpen]);

  const onSubmit = async (data: GroupFormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    const fieldsJson = JSON.stringify(data.fields);
    formData.append('fields', fieldsJson);
    
    try {
      const result = await updateGroup(formData, groupId);
      if (result.success) {
       
        setIsOpen(false);
      } else {
       
      }
    } catch (error) {
      console.error('Error updating group:', error);
    
    }
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='secondary' className="w-full items-center rounded-md">Grubu Düzenle</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Grubu Düzenle</SheetTitle>
          <SheetDescription>
            Halısaha grubunuzu düzenleyiniz.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div>Yükleniyor...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Halısaha Grubu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grup Açıklaması</FormLabel>
                    <FormControl>
                      <Input placeholder="Açıklama" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel className='mb-4'>Sahalar</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex space-x-2 mb-2">
                    <FormField
                      control={form.control}
                      name={`fields.${index}.field_name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Saha adı" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.field_location`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Konumu" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Sil
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ field_name: '', field_location: '' ,id: null})}
                  className="mt-2"
                >
                  Alan Ekle
                </Button>
              </div>
              <SheetFooter>
                <Button type="submit">Değişiklikleri Kaydet</Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}