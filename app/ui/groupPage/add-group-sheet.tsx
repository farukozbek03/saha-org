'use client'
import React from 'react';
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
import { createNewGroup } from '@/app/lib/action';

const groupFormSchema = z.object({
  name: z.string().min(2, { message: 'Grup adınız en az 2 harften oluşmalıdır' }),
  description: z.string(),
  fields: z.array(
    z.object({
      field_name: z.string().min(1, { message: 'Alan adı gereklidir' }),
      field_location: z.string().min(1, { message: 'Alan konumu gereklidir' }),
    })
  ).min(1, { message: 'En az bir alan gereklidir' }),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

export default function AddGroupSheet() {
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

  const onSubmit = async (data: GroupFormValues) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description)
    const fieldsJson = JSON.stringify(data.fields);
    formData.append('fields', fieldsJson);
    const result = await createNewGroup(formData);
    console.log('Create group result:', result)
    if (result.success) {
        // Handle success (e.g., show a success message, close the sheet)
    } else {
        // Handle error (e.g., show an error message)
    }
}

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full items-center rounded-md">Grup Ekle</Button>
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
            <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}