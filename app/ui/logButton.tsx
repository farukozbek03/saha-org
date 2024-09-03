import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LogButton() {
    const cookieStore = cookies()
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()

    async function signOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        redirect('/')
    }

    if (!user) {
        return (
            <form action="/login" method="get">
                <Button type="submit">Log In</Button>
            </form>
        )
    } else {
        return (
            <form action={signOut}>
                <Button type="submit">Sign Out</Button>
            </form>
        )
    }
}