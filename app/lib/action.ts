'use server'
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"

export async function createNewGroup(formData: FormData) {
        const supabase = createClient()
        
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const fields = JSON.parse(formData.get('fields') as string)
    
        try {
            const { data, error } = await supabase
            .rpc('create_group', { name, description })
    
            if (error) throw error
    
            console.log('Group created successfully:', data)
    
            // Now insert the fields
            if (data && data.id) {
                const { error: fieldsError } = await supabase
                .from('groupfields')
                .insert(fields.map((field: any) => ({
                    group_id: data.id,
                    ...field
                })))
    
                if (fieldsError) throw fieldsError
            }
            revalidatePath('/dashboard')
            return { success: true, group: data }
    
        } catch (error: any) {
            console.error('Error in createNewGroup:', error)
            return { 
                success: false, 
                error: error.message || 'An unexpected error occurred',
                code: error.code
            }
        }
    }
export async function createAvailabilities(formData: FormData, groupId: string) {
    const supabase = createClient()
    const fields = JSON.parse(formData.get('fields') as string)
    const dates = JSON.parse(formData.get('dates') as string)
    const start_time = formData.get('start_time') as string
    const end_time = formData.get('end_time') as string
    
    const results = []
    const errors = []

    try {
        const { error: deleteError } = await supabase.rpc('delete_user_availabilities', {
            p_group_id: groupId
        })

        if (deleteError) throw deleteError

        for (const field_id of fields) {
            for (const date of dates) {
                try {
                    const { data, error } = await supabase.rpc('create_availability', {
                        group_field_id: field_id,
                        group_id: groupId,
                        date: new Date(date).toISOString().split('T')[0], // Convert to 'YYYY-MM-DD' format
                        start_time: start_time,
                        end_time: end_time
                    })

                    if (error) throw error
                    
                    results.push(data)
                    console.log('Availability created:', data)
                } catch (error) {
                    console.error('Error creating availability:', error)
                    errors.push({ field_id, date, error })
                }
            }
        }
    } catch (error) {
        console.error('Error in availability management:', error)
        errors.push({ error })
    }

    revalidatePath(`/dashboard/${groupId}`)
    return {
        success: errors.length === 0,
        results: results,
        errors: errors
    }
}



export async function addToGroup(groupId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.rpc('add_group_member', {
      p_group_id: groupId,
    });

    if (error) {
      throw error;
    }

    revalidatePath('/dashboard');

  } catch (error) {
    console.error('Error in addToGroup:', error);
    throw new Error('Failed to add to group');
  }
}

export async function updateGroup(formData: FormData, groupId: string) {
        console.log(formData)
        const supabase = createClient()
        
        const id = groupId
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const fields = JSON.parse(formData.get('fields') as string)
    
        try {
            // Update the group
            const { data, error } = await supabase
                .from('groups')
                .update({ name, description })
                .eq('id', id)
                .select()
    
            if (error) throw error
    
            console.log('Group updated successfully:', data)
    
            // Update the fields
            if (data && data[0]) {
                // Separate fields into those to update and those to insert
                const fieldsToUpdate = fields.filter((field: any) => field.id != null);
                const fieldsToInsert = fields.filter((field: any) => field.id == null);
                console.log('fields to update')
                console.log(fieldsToUpdate)
                console.log('fields to insert')
                console.log(fieldsToInsert)
                
                // Update existing fields
                if (fieldsToUpdate.length > 0) {
                    const { error: updateError } = await supabase
                        .from('groupfields')
                        .upsert(fieldsToUpdate.map((field: any) => ({
                            id: field.id,
                            group_id: id,
                            field_name: field.field_name,
                            field_location: field.field_location
                        })))
    
                    if (updateError) throw updateError;
                }
                const currentFieldIds = fields.filter((field: any) => field.id != null).map((field: any) => field.id);
                if (currentFieldIds.length > 0) {
                    const { error: deleteError } = await supabase
                        .from('groupfields')
                        .delete()
                        .eq('group_id', id)
                        .not('id', 'in', `(${currentFieldIds.join(',')})`)
    
                    if (deleteError) throw deleteError;
                }
                // Insert new fields
                if (fieldsToInsert.length > 0) {
                    const { error: insertError } = await supabase
                        .from('groupfields')
                        .insert(fieldsToInsert.map((field: any) => ({
                            group_id: id,
                            field_name: field.field_name,
                            field_location: field.field_location
                        })))
    
                    if (insertError) throw insertError;
                }
    
                // Delete fields that are no longer present
                
            }
    
            revalidatePath('/dashboard')
            return { success: true, group: data[0] }
    
        } catch (error: any) {
            console.error('Error in updateGroup:', error)
            return { 
                success: false, 
                error: error.message || 'An unexpected error occurred',
                code: error.code
            }
        }
    }
export async function deleteGroup(groupId : string) {
    const supabase = createClient()
    try{
        const { data ,error} = await supabase.from('groups').delete().eq('id',groupId)
        revalidatePath('/dashboard')
        redirect('/dashboard')
    }
    catch(error) {
        throw error
    }
        
    
}

export async function deleteTheMatches(groupId:string) {
    const supabase = await createClient()
    try {
        const { error: deleteError} = await supabase.from('availability').delete().eq('group_id',groupId)
        if (deleteError) throw deleteError;
        revalidatePath('/')
    } catch(error) {
        console.error('Error in deleteTheMatches:', error)
            return { 
                success: false, 
            }
    }
    
}