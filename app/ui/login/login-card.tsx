'use client'
import { login } from "@/app/login/actions"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
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
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useState } from "react"

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})


export default function LoginCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
   
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('redirectTo', redirectTo)
    try {
      const result = await login(formData)
      if (result?.error) {
        setError(result.error)
      }
    } finally {
      setIsLoading(false)
    }
  }
   
  return (
    <Card>
        <CardHeader>
            <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="sahaorg@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </Form>
        </CardContent>
        <CardFooter>
            <p className="">
                Hesabınız yok mu?<Link className='ml-2 hover:text-primary hover:underline' href={{ pathname:'/signup', query: { redirectTo: redirectTo } }}> Kayıt Ol</Link>
            </p>
        </CardFooter>
    </Card>
  )
}