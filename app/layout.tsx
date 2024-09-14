import type { Metadata } from "next";
import { inter } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import Navbar from '@/app/ui/navbar'


export const metadata = {
  title: 'SahaOrg',
  description: 'Halısaha ayarlamanın en kolay yolu!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
