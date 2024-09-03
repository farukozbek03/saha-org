import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

const GroupLinks = dynamic(() => import('./group-links'), { ssr: false })

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

export function MobileSideNav() {
    return (
        <div className="md:hidden mx-4 mt-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full" variant="default">Gruplar <ArrowDown className='w-4 h-4 ml-2' /></Button>
        </SheetTrigger>
        <SheetContent side='top'>
          <SheetHeader>
            <SheetTitle>Gruplar</SheetTitle>
            
          </SheetHeader>
          <GroupLinks />
          
        </SheetContent>
      </Sheet>
      </div>
    )
  }