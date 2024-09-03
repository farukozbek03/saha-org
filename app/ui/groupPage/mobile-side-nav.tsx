import { Button } from "@/components/ui/button"

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




export function MobileSideNav() {
    return (
        <div className="md:hidden mx-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="w-full" variant="default">Gruplar </Button>
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