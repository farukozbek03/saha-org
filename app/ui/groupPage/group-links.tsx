
import { Button } from '@/components/ui/button'
import Link from 'next/link';
import clsx from 'clsx'
import { fetchGroupsById} from '@/app/lib/data';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddGroupSheet from '@/app/ui/groupPage/add-group-sheet';
import { Suspense } from 'react';


export default async function GroupLinks() {
  const supabase = await createClient()
  const {data : {user},error} = await supabase.auth.getUser()
  if (error) throw error
  if (!user) {
    console.log('No user is currently signed in')
    redirect('/login')
  }
  const userId = user.id
  const links = await fetchGroupsById(userId)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={`/dashboard/${link.id}`}
            className=
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md  hover:bg-accent-foreground hover:text-accent md:flex-none md:justify-start md:p-2 md:px-3'
            
          >
            <p className=" md:block">{link.name}</p>
          
          </Link>
        );
      })}
      <div className='flex justify-center mx-2 mt-2'>
        <AddGroupSheet/>
      </div>
      
    </Suspense>
  );
}
