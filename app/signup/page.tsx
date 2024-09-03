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

    </div>
  )
}