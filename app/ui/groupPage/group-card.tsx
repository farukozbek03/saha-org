import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  
import {Button} from '@/components/ui/button'
import GroupMembers from "./group-members"
import { fetchGroupData } from "@/app/lib/data"
import EditGroup from "./edit-group-sheet"
import DeleteButtons from "./deleting-buttons"
import AdminButtons from "./admin-buttons"
import Link from "next/link"
import CopyableLink from "./copyable-link"
export default async function GroupCard({groupId}: {groupId : string}) {
    const groupData = await fetchGroupData(groupId)
    return (
    <div>
        <Card>
        <CardHeader>
            <CardTitle>Grup Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
            <GroupMembers groupId={groupId}/>
            

        </CardContent>
        <CardFooter className="flex flex-col">
            <CopyableLink groupId={groupId}/>
            <AdminButtons groupId={groupId}/>
        </CardFooter>
        </Card>


    </div>
   )

}