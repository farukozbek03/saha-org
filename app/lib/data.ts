import { supabase } from '@/app/lib/supabaseClient';
import { User, Group, GroupMember, Field, GroupField, Availability, MatchSuggestion } from './types';

// Initialize Supabase client


// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw error;
  return data;
};

// Fetch all groups
export async function fetchGroups() {
    const { data, error } = await supabase
        .from('groups')
        .select('*');

    if (error) {
        console.error('Error fetching groups:', error);
        return [];
    }

    return data;
}

export async function isGroupMember(group_id: string, user_id: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('groupmembers')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group_id)
      .eq('user_id', user_id);

    if (error) throw error;
    return count ? count > 0 : false;
  } catch (error) {
    console.error('Error checking group membership:', error);
    throw error;
  }
}


import { SupabaseClient } from '@supabase/supabase-js'

type AvailabilityData = {
  group_field_id: string
  date: string
  start_time: string
  end_time: string
}

export type AvaFormValues = {
  fields: string[]
  dates: Date[]
  start_time: string
  end_time: string
}

export async function fetchUserAvailability(groupId: string, userId: string): Promise<AvaFormValues> {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('group_id', groupId)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user availability:', error)
    throw error
  }

  // Ensure data is not undefined and cast it to the correct type
  const availabilityData = data as AvailabilityData[] | null

  if (!availabilityData || availabilityData.length === 0) {
    return {
      fields: [],
      dates: [],
      start_time: '',
      end_time: ''
    }
  }

  // Use Sets to automatically remove duplicates
  const fieldsSet = new Set<string>()
  const datesSet = new Set<string>()
  let start_time = ''
  let end_time = ''

  availabilityData.forEach(item => {
    fieldsSet.add(item.group_field_id)
    datesSet.add(item.date)
    
    // Only set start_time and end_time if they haven't been set yet
    if (!start_time) start_time = item.start_time.slice(0, 5)
    if (!end_time) end_time = item.end_time.slice(0, 5)
  })

  // Transform the data to match the form structure
  const transformedData: AvaFormValues = {
    fields: Array.from(fieldsSet),
    dates: Array.from(datesSet).map(dateString => new Date(dateString)),
    start_time,
    end_time
  }

  return transformedData
}
type GroupFormValues = {
  name: string;
  description: string;
  fields: {
    id : string
    field_name: string;
    field_location: string;
  }[];
}

export async function fetchGroupData(groupId: string): Promise<GroupFormValues> {

  try {
    // Fetch group details
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .select('name,description')
      .eq('id', groupId)
      .single();

    if (groupError) throw groupError;

    // Fetch group fields
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('groupfields')
      .select('field_name,field_location,id')
      .eq('group_id', groupId);

    if (fieldsError) throw fieldsError;

    // Format the data according to GroupFormValues type
    const formattedData: GroupFormValues = {
      name: groupData.name,
      description: groupData.description,
      fields: fieldsData.map(field => ({
        id : field.id,
        field_name: field.field_name,
        field_location: field.field_location
      }))
    };

    return formattedData;

  } catch (error) {
    console.error('Error fetching group data:', error);
    throw error;
  }
}

export async function fetchGroupAdmin(groupId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('created_by')
      .eq('id', groupId)
      .single();

    if (error) throw error;
    
    if (!data || typeof data.created_by !== 'string') {
      throw new Error('Created_by field not found or invalid');
    }

    return data.created_by;
  } catch (error) {
    console.error('Error fetching group admin:', error);
    throw error;
  }
}

export async function fetchGroupsById(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        id,
        name,
        description,
        created_by,
        created_at,
        updated_at,
        groupmembers!inner(user_id)
      `)
      .eq('groupmembers.user_id', user_id)

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching groups:', error)
    throw error
  }
}
// Fetch group members by group ID
export const fetchGroupMembersIdsAndNames = async (groupId: string): Promise<{user_id: string, display_name: string}[]> => {
  const { data, error } = await supabase.from('groupmembers').select('*').eq('group_id', groupId);
  if (error) throw error;
  return data;
}

export const fetchNameFromUserId: (userId: string) => Promise<string> = async (userId: string): Promise<string> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data.username;
}
// Fetch fields
export const fetchFields = async (): Promise<Field[]> => {
  const { data, error } = await supabase.from('Fields').select('*');
  if (error) throw error;
  return data;
};

// Fetch group fields by group ID
export const fetchGroupFields = async (groupId: string): Promise<GroupField[]> => {
  const { data, error } = await supabase.from('groupfields').select('*').eq('group_id', groupId);
  if (error) throw error;
  return data;
};

// Fetch availability for a group field
export const fetchAvailability = async (groupId: string): Promise<Availability[]> => {

  const { data, error } = await supabase.from('availability').select('*').eq('group_id', groupId);
  if (error) throw error;
  return data;
};

// Fetch match suggestions for a group
export const fetchMatchSuggestions = async (groupId: string): Promise<MatchSuggestion[]> => {
  const { data, error } = await supabase.from('matchsuggestions').select('*').eq('group_id', groupId);
  if (error) throw error;
  return data;
};

export const fetchGroupName = async (groupId: string): Promise<{'name':string,'desc':string}> => {
  const { data, error } = await supabase.from('groups').select('name,description').eq('id', groupId).single();
  if (error) throw error;
  return {'name':data.name,'desc':data.description};
};

export const fetchFieldIdFromGroupFieldId = async (groupFieldId: string): Promise<string> => {
  const { data, error } = await supabase.from('groupfields').select('*').eq('id', groupFieldId).single();
  if (error) throw error;
  return data.field_id;
}
export const fetchFieldName = async (groupFieldId: string): Promise<string> => {
  const { data, error } = await supabase.from('groupfields').select('*').eq('id', groupFieldId).single();
  if (error) throw error;
  return data.field_name;
}

import { createClient } from '@supabase/supabase-js'



export const fetchDisplayName = async (userIds: string[]): Promise<string[]> => {
  const { data, error } = await supabase
    .from('groupmembers')
    .select('user_id, display_name')
    .in('user_id', userIds)

  if (error) {
    console.error('Error fetching display names:', error)
    throw error
  }

  const userMap = new Map(data.map(user => [user.user_id, user.display_name]))

  return userIds.map(id => userMap.get(id) || 'Unknown User')
}

// Insert a new user
export const insertUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const { data, error } = await supabase.from('Users').insert(user).select().single();
  if (error) throw error;
  return data;
};

// Insert a new group
export const insertGroup = async (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<Group> => {
  const { data, error } = await supabase.from('Groups').insert(group).select().single();
  if (error) throw error;
  return data;
};

// Insert a new group member
export const insertGroupMember = async (groupMember: Omit<GroupMember, 'id' | 'joinedAt'>): Promise<GroupMember> => {
  const { data, error } = await supabase.from('GroupMembers').insert(groupMember).select().single();
  if (error) throw error;
  return data;
};

// Insert a new field
export const insertField = async (field: Omit<Field, 'id' | 'createdAt' | 'updatedAt'>): Promise<Field> => {
  const { data, error } = await supabase.from('Fields').insert(field).select().single();
  if (error) throw error;
  return data;
};

// Insert a new group field
export const insertGroupField = async (groupField: Omit<GroupField, 'id' | 'addedAt'>): Promise<GroupField> => {
  const { data, error } = await supabase.from('GroupFields').insert(groupField).select().single();
  if (error) throw error;
  return data;
};

// Insert a new availability
export const insertAvailability = async (availability: Omit<Availability, 'id' | 'createdAt'>): Promise<Availability> => {
  const { data, error } = await supabase.from('Availability').insert(availability).select().single();
  if (error) throw error;
  return data;
};

// Insert a new match suggestion
export const insertMatchSuggestion = async (matchSuggestion: Omit<MatchSuggestion, 'id' | 'createdAt'>): Promise<MatchSuggestion> => {
  const { data, error } = await supabase.from('MatchSuggestions').insert(matchSuggestion).select().single();
  if (error) throw error;
  return data;
};

// Update a user's information
export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const { data, error } = await supabase.from('Users').update(user).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Delete a group by ID
export const deleteGroup = async (id: string): Promise<void> => {
  const { error } = await supabase.from('Groups').delete().eq('id', id);
  if (error) throw error;
};

export default supabase;
