import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
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
import GroupLinks from "./group-links"
import { ArrowDown } from 'lucide-react'




export function MobileSideNav() {
    return (
        <div className="md:hidden mx-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full" variant="default">Gruplar <ArrowDown width={20} height={20}/></Button>
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