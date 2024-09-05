import { Button } from "@/components/ui/button"
import GroupLinks from "./group-links"
import Link from 'next/link';
import clsx from 'clsx'
import { fetchGroupsById} from '@/app/lib/data';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AddGroupSheet from '@/app/ui/groupPage/add-group-sheet';
import { Suspense } from 'react';


import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {ArrowDown} from 'lucide-react'

export async function MobileSideNav() {
  const supabase = await createClient()
  const {data : {user},error} = await supabase.auth.getUser()
  if (error) throw error
  if (!user) {
    redirect('/login')
  }
  const userId = user.id
  const links = await fetchGroupsById(userId)
    return (
        <div className="md:hidden mx-4 mt-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full" variant="default">Gruplarım <ArrowDown className='w-4 h-4' /></Button>
        </SheetTrigger>
        <SheetContent side='top'>
          <SheetHeader>
            <SheetTitle className='mb-4'>Gruplarım</SheetTitle>
            
          </SheetHeader>
          
          <Suspense fallback={<div>Loading...</div>}>
      
            {links.map((link) => (
              <SheetClose key={link.id} asChild>
                <Link
                  href={`/dashboard/${link.id}`}
                  className='flex h-[48px] grow items-center justify-center gap-2 rounded-md hover:bg-accent-foreground hover:text-accent md:flex-none md:justify-start md:p-2 md:px-3'
                >
                  <p className="md:block">{link.name}</p>
                </Link>
              </SheetClose>
            ))}
            <div className='flex justify-center mx-2 mt-2'>
              <SheetClose asChild>
                <AddGroupSheet/>
              </SheetClose>
            </div>
            
          </Suspense>
          
        </SheetContent>
      </Sheet>
      </div>
    )
  }