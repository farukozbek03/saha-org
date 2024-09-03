import { fetchGroupMembersIdsAndNames,fetchNameFromUserId } from "@/app/lib/data";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export default async function GroupMembers({groupId}: {groupId: string})  {
    const members = await fetchGroupMembersIdsAndNames(groupId);

    return <Table>
    <TableHeader>
        <TableRow><TableHead className=''>Grup Üyeleri</TableHead></TableRow>
    </TableHeader>
    <TableBody>
       {members.map((member) => (
        <TableRow key={member.user_id}><TableCell className="font-medium">{member.display_name}</TableCell></TableRow>
      ))}
    </TableBody>

    </Table>;
}