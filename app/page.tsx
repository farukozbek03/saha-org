import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center mt-8">
      <div className="flex flex-col items-center justify-center mb-8">
      <h1 className="text-2xl font-bold mb-2"> SahaOrg&apos;a Hoşgeldiniz </h1>
      <h3 className="text-lg mb-2">Grup oluştur. Link paylaş. Maç ayarlansın.</h3>
      <Link href='/dashboard'>
      <Button >Gruplara Git</Button></Link>
      </div>
      <Image src='/hero.png' alt='sahaorg-home' width={500} height={500} />
      
      </section>
  );
}
