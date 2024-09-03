import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center mt-8"><h1> Dashboarda Git </h1><Link href='/dashboard'><Button >Button</Button></Link></section>
  );
}
