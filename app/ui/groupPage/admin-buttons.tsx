import { createClient } from "@/utils/supabase/server";
import { fetchGroupAdmin } from "@/app/lib/data";
import EditGroup from "./edit-group-sheet"
import DeleteButtons from "./deleting-buttons"
export default async function AdminButtons({groupId} : {groupId : string}) {
    const supabase = await createClient()
    const {data : {user}} = await supabase.auth.getUser()
    const adminId = await fetchGroupAdmin(groupId)
    console.log(adminId)
    console.log(typeof adminId)
    if ( user!.id !== adminId) {
        return <></>
    }else {
    return (
        <div className="space-y-2 w-full">
        <EditGroup groupId={groupId}/>
        <DeleteButtons groupId={groupId}/>
        </div>
    )
    }
}