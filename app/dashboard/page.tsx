import OrgTable from '../ui/groupPage/org-table';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { fetchGroupsById } from '../lib/data';
export default async function Page() {
    const supabase = await createClient()
    const {data : {user},error} = await supabase.auth.getUser()
    if (!user) {
        return redirect('/login')
    }
    if (error) throw error
    if (!user) {
        redirect('/login')
    }
    const userId = user.id
    const links = await fetchGroupsById(userId)
    if (links.length > 0) {
        redirect(`/dashboard/${links[0].id}`)
    }
  
    return (
        <div className='flex flex-col h-screen'>
            <h1 className='text-2xl text-center font-bold'>Henüz herhangi bir gruba dahil değilsiniz.</h1>
            <p className='text-sm text-center text-gray-500 md:hidden'>Yukardaki butona tıklayıp yeni bir grup oluşturabilir veya arkadaşınızın paylaştığı link ile gruba dahil olabilirsiniz.</p>
            <p className='text-sm text-center text-gray-500 hidden md:block'>Ekranın solundaki grup ekle butonuna tıklayıp yeni bir grup oluşturabilir veya arkadaşınızın paylaştığı link ile gruba dahil olabilirsiniz.</p>
        </div>
    );
}