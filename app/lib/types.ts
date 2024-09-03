// User type
export type User = {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  // Group type
  export type Group = {
    id: string;
    name: string;
    description?: string;
    createdBy: string; // User ID
    createdAt: Date;
    updatedAt: Date;
  };
  
  // GroupMember type
  export type GroupMember = {
    id: string;
    groupId: string; // Group ID
    userId: string; // User ID
    joinedAt: Date;
  };
  
  // Field type
  export type Field = {
    id: string;
    name: string;
    location: string;
    createdBy: string; // User ID
    createdAt: Date;
    updatedAt: Date;
  };
  
  // GroupField type
  export type GroupField = {
    id: string;
    group_id: string; // Group ID
    field_id: string; 
    field_name: string; 
    field_location: string; 
    created_by: string; // Field ID
    added_at: Date;
  };
  
  export type FieldForForm= {
    id: string
    name: string
  }
  // Availability type
  export type Availability = {
    id: string;
    group_field_id: string;
    user_id: string;
    date: string | Date; // Allow for both string and Date objects
    start_time: string;
    end_time: string;
    created_at: string | Date;
  };
  // MatchSuggestion type
  export type MatchSuggestion = {
    id: string;
    groupId: string; // Group ID
    fieldId: string; // Field ID
    dayOfWeek: number; // 0 = Sunday, 6 = Saturday
    startTime: string; // Time in HH:MM format
    endTime: string; // Time in HH:MM format
    matchCount: number; // Number of users matching this time
    createdAt: Date;
  };
  
  export type Result = {
    group_field_id: string;
    date: string;
    timeSlot: string;
    count: number;
  }