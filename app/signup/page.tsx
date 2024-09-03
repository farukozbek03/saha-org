import { login, signup } from '@/app/login/actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SignUpCard from '../ui/signup/signup-card'
export default async function LoginPage() {
  const supabase = await createClient()
  const {data : {user}} = await supabase.auth.getUser()
  if (user) {
      return redirect('/dashboard')
  }
  
  return (
    <div className='max-w-2xl mx-auto justify-center'>
    <div className='flex flex-col gap-2 w-200 mt-8'>
      <SignUpCard/>
    </div>
    {/* <form className='flex flex-col gap-2 w-200 border-2'>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form> */}
    </div>
  )
}