'use client'
import {GroupField ,FieldForForm} from '@/app/lib/types'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {defaultErrorMap, z} from 'zod'
import { Calendar } from "@/components/ui/calendar"
import {createAvailabilities} from '@/app/lib/action'
import { useEffect, useState } from 'react';
import {fetchUserAvailability} from '@/app/lib/data'

// Updated FormSchema to make start_time and end_time required
const FormSchema = z.object({
  fields: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  dates: z.array(z.date()).min(1, "Please select at least one date."),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required")
}).refine((data) => {
  // Custom validation to ensure end_time index is greater than start_time index
  const startIndex = times.findIndex(t => t.time === data.start_time);
  const endIndex = times.findIndex(t => t.time === data.end_time);
  return endIndex > startIndex;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
});

const times = [
    {'time':'14:00', 'index':0},
    {'time':'15:00','index':1},
    {'time':'16:00', 'index':2},
    {'time':'17:00', 'index':3},
    {'time':'18:00', 'index':4},
    {'time':'19:00', 'index':5},
    {'time':'20:00', 'index':6},
    {'time':'21:00', 'index':7},
    {'time':'22:00', 'index':8},
    {'time':'23:00', 'index':9},
    {'time':'00:00', 'index':10},
    {'time':'01:00', 'index':11},
    {'time':'02:00', 'index':12},
    {'time':'03:00', 'index':13},
    {'time':'04:00', 'index':14},
]
type DefaultValues = {
  fields: string[];
  dates: Date[];
  start_time: string;
  end_time: string;
}
export default function AvaFrom({fields,groupId,defaultValues} : {fields: FieldForForm[],groupId : string,defaultValues : DefaultValues}) {
  const[isLoading,setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fields:[],
      dates: [],
      start_time:  '' || defaultValues.start_time,
      end_time: '' ||  defaultValues.end_time
    },
  })

  useEffect(() => {
    form.reset({
      fields: defaultValues.fields,
      dates: defaultValues.dates,
      start_time: defaultValues.start_time,
      end_time: defaultValues.end_time
    });
  }, [defaultValues, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const adjustedDates = data.dates.map(date => {
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
      });
      formData.append('fields', JSON.stringify(data.fields));
      formData.append('dates', JSON.stringify(adjustedDates));
      formData.append('start_time', data.start_time);
      formData.append('end_time', data.end_time);

      const result = await createAvailabilities(formData, groupId);
      
      if (result.success) {
        console.log('All availabilities created successfully:', result.results);
        // You might want to add some user feedback here, like a success message
      } else {
        console.error('Some availabilities failed to create:', result.errors);
        // You might want to add some user feedback here, like an error message
      }
    } catch (error) {
      console.error('An error occurred while submitting the form:', error);
      // You might want to add some user feedback here, like an error message
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="fields"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Sahalar</FormLabel>
                  
                </div>
                {fields.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="fields"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Tarihler</FormLabel>
                  <FormDescription>
                    Uygun olduğunuz tarihleri seçiniz.
                  </FormDescription>
                </div>
                <Calendar
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                  className="rounded-md border"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className=''>
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıc Zamanı</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {times.map((item) => (
                        <SelectItem key={item.time} value={item.time}>{item.time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bitiş Zamanı</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {times.map((item) => (
                        <SelectItem key={item.time} value={item.time}>{item.time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Gönderiliyor...' : 'Gönder'}
          </Button>
        </form>
      </Form>
    </div>
  )
}