import Link from 'next/link';
import GroupLinks from './group-links';
import { Suspense } from 'react';

export default function SideNav() {
  return (
    <div className="hidden md:flex md:h-full md:flex-col md:px-3 md:py-4 md:border-b-1 md:border-secondary md:border-r-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="hidden h-auto w-full grow rounded-md bg-muted md:block">
          <Suspense fallback={<div>Loading...</div>}><GroupLinks /></Suspense>
        
        </div>

          
      </div>
    </div>
  );
}
