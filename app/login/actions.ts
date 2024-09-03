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
    console.log('Error logging in')
    redirect('/error')
  }

  console.log('Successfully logged in')
  redirect(redirectTo || '/dashboard')
}


export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options : {
      data: {
        display_name: formData.get('displayName') as string
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log('Error signed up')

    redirect('/error')

  }
  console.log('Successfully signed up')

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signout()  {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')

}