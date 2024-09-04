'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { loginFormSchema } from '../ui/login/login-card'
export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const redirectTo = formData.get('redirectTo') as string

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'Giriş Yapılamadı. Bilgilerinizi kontrol ediniz' }
  }

  redirect(redirectTo || '/dashboard')
}


interface SignupResult {
  error?: string;
  success?: boolean;
}

export async function signup(formData: FormData): Promise<SignupResult> {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        display_name: formData.get('displayName') as string
      }
    }
  }
  const redirectTo = formData.get('redirectTo') as string

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: 'Kayıt olunamadı. Lütfen bilgilerinizi kontrol edin.' }
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo || '/dashboard')
  return { success: true }
}

export async function signout()  {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')

}