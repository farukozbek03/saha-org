'use client'
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
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
import { createNewGroup } from '@/app/lib/action';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Grup adınız en az 2 harften oluşmalıdır' }),
  description: z.string(),
  fields: z.array(
    z.object({
      field_name: z.string().min(1, { message: 'Alan adı gereklidir' }),
      field_location: z.string().optional(),
    })
  ).min(1, { message: 'En az bir alan gereklidir' }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function AddGroupSheet() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      fields: [
        { field_name: '', field_location: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const router = useRouter();

  const onSubmit = async (data: GroupFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      const fieldsJson = JSON.stringify(data.fields);
      formData.append('fields', fieldsJson);
      const result = await createNewGroup(formData);
      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Grup başarıyla oluşturuldu.",
        });
        setIsOpen(false);
        form.reset();
        router.push(`/dashboard/${result.group.id}`)
        // Scroll to top of the page
      } else {
        console.log(result)

        toast({
          title: "Hata",
          description: "Grup oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error)

      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="w-full items-center rounded-md">Grup Ekle</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Grup Ekle</SheetTitle>
          <SheetDescription>
            Halısaha grubunuzu oluşturunuz.
          </SheetDescription>
        </SheetHeader>
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
                        <FormMessage />
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
                onClick={() => append({ field_name: '', field_location: '' })}
                className="mt-2"
              >
                Alan Ekle
              </Button>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Grup Oluşturuluyor...' : 'Grup Oluştur'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}