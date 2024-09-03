import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import OrgTable from "./org-table"
import { fetchGroupName } from "@/app/lib/data"

export default async function InfoCard({groupId} : {groupId : string}) {
    const groupName = await fetchGroupName(groupId)
    return (
        <Card>
        <CardHeader>
            <CardTitle>{groupName.name}</CardTitle>
            <CardDescription>{groupName.desc}</CardDescription>
        </CardHeader>
        <CardContent>
            <Separator />
            <OrgTable groupId={groupId} />
        </CardContent>
        <CardFooter>
            
        </CardFooter>
        </Card>

    )

}