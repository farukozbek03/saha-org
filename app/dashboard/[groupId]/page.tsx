import { Suspense } from 'react';
import AvaFrom from '@/app/ui/groupPage/availability-form';
import OrgTable from '@/app/ui/groupPage/org-table';
import { isGroupMember, fetchGroupFields } from '@/app/lib/data';
import { FieldForForm } from '@/app/lib/types';
import { Separator } from "@/components/ui/separator"
import GroupMembers from '@/app/ui/groupPage/group-members';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import GroupCard from '@/app/ui/groupPage/group-card';
import AvaFormCard from '@/app/ui/groupPage/ava-form-card';
import InfoCard from '@/app/ui/groupPage/info-card';




export default async function Page({ params }: { params: { groupId: string } }) {
  const id = params.groupId;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='md:grid md:grid-cols-12 gap-8 justify-items-center'>
        <div className='flex flex-col mb-4 md:col-span-4'>
          <InfoCard groupId={id}/>
        </div>
        <div className='md:col-span-4'>
          <AvaFormCard groupId={id}/>
        </div>
        <div className='md:col-span-4'>
          <GroupCard groupId={id}/>
        </div>
      </div>
    </Suspense>
  );
}