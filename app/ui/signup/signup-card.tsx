'use client'
import { signup } from "@/app/login/actions"
import {
    Card,
    CardContent,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useSearchParams } from 'next/navigation'
import { useState } from "react"

interface SignupResult {
  error?: string;
}

export const signUpFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.string().email({message: "Invalid email"}),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpCard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'
   
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('displayName', data.displayName)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('redirectTo', redirectTo)
    try {
      const result = await signup(formData) as unknown as SignupResult;
      if (result?.error) {
        setError(result.error);
      }
    } finally {
      setIsLoading(false)
    }
  }
   
  return (
    <Card>
        <CardHeader>
            <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </Form>
        </CardContent>
        <CardFooter>
            <p className="">
                Already have an account?<Link className='ml-2 hover:text-primary hover:underline' href={{ pathname:'/login', query: { redirectTo: redirectTo } }}> Sign In</Link>
            </p>
        </CardFooter>
    </Card>
  )
}