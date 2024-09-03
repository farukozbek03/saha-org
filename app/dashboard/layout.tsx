import SideNav from '@/app/ui/groupPage/sidenav'
import { MobileSideNav } from '../ui/groupPage/mobile-side-nav'


export default function Layout({children}:{children: React.ReactNode}) {
    return (   
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <MobileSideNav />
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    )
}
