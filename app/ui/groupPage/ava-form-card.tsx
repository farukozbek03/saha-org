import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import AvaForm from "./availability-form"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {  fetchGroupFields, fetchUserAvailability, isGroupMember } from "@/app/lib/data";
import { FieldForForm } from "@/app/lib/types";


async function fetchFields(groupId: string): Promise<FieldForForm[]> {
    const response = await fetchGroupFields(groupId);
    const fieldNames: FieldForForm[] = [];
    
    if (response) {
      for (const field of response) {
        fieldNames.push({
          'id': field.id,
          'name': field.field_name
        });
      }
    }
  
    return fieldNames;
  }

  export default async function AvaFormCard({groupId} : {groupId: string}) {
    const supabase = await createClient()
    const {data : {user}} = await supabase.auth.getUser()
    const id = groupId;
    if (!user) {
      console.log('No user is currently signed in');
      redirect('/login')
    }
    const isMember = await isGroupMember(id, user.id);
    if (!isMember) {
      redirect('/dashboard')
    }
    let fields = await fetchFields(id);
  
    if (!fields) {
      fields = []
    }

    const availabilityData = await fetchUserAvailability(groupId, user.id)
  
    return (
        <Card className="mb-4">
        <CardHeader>
            <CardTitle>Uygunluk Formu</CardTitle>
            <CardDescription>Katılım sağlayabileceğiniz gün,saat aralığıve sahaları seçiniz.</CardDescription>
        </CardHeader>
        <CardContent>
            <AvaForm fields={fields} groupId={groupId} defaultValues={availabilityData} />
        </CardContent>
       
        </Card>
    )
}