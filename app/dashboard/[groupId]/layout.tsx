import { Toaster } from "@/components/ui/toaster"

export default function Layout({children}:{children: React.ReactNode}) {
    return (   
        <div className="flex h-screen flex-col md:flex-row ">
            <div className="w-full flex-none md:w-fit  ">
                {children}
                <Toaster />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12"></div>
        </div>
    )
}
