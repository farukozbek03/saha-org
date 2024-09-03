import {createClient} from '@/utils/supabase/server'
import Link from 'next/link';
import {Button} from '@/components/ui/button'
import { signout } from '../login/actions';

export default async function Navbar() {
  const supabase = await createClient();
  const {data: {user}} = await supabase.auth.getUser();

  return (
    <nav className="shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 ">
           
          <div className="flex-1 flex  sm:items-stretch ">
            <div className="flex-shrink-0">
              <Link href="/" className="text-black text-xl font-bold">
                SahaOrg
              </Link>
            </div>

          </div>
          {user !== null ? (
            <form action={signout} className='justify-end flex flex-row gap-4 items-center'>  
            <p>{user.email}</p>
            <Button type='submit' variant='secondary'>Sign Out</Button>
            </form>
          ): (
           <Link href={'/login'}> <Button variant='default'>Sign In</Button></Link>
          )}
          
        </div>
      </div>
    </nav>
  );
}
