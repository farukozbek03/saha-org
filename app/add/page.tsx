'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addToGroup } from "@/app/lib/action";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchGroupName, isGroupMember } from "@/app/lib/data";
import { createClient } from '@/utils/supabase/client';

export default function AddGroup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [groupName, setGroupName] = useState({ name: '', desc: '' });
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            const groupId = searchParams.get('groupid');
            if (!groupId) {
                router.push('/dashboard');
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const fetchedGroupName = await fetchGroupName(groupId);
            setGroupName(fetchedGroupName);

            const isMember = await isGroupMember(groupId, user.id);
            if (isMember) {
                router.push(`/dashboard/${groupId}`);
            }
        }

        fetchData();
    }, [searchParams, router, supabase.auth]);

    const handleJoinGroup = async () => {
        try {
            const groupId = searchParams.get('groupid');
            if (groupId) {
                await addToGroup(groupId);
                router.push('/dashboard'); // Redirect after successful operation
            } else {
                console.error('Group ID is missing');
            }
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    };

    return (
        <section className="flex justify-center">
        <div className=" mt-8 mx-8 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl lg:text-3xl">{groupName.name}</CardTitle>
                    <CardDescription className="text-sm md:text-base lg:text-lg">{groupName.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Grubu katılmak için tıklayınız</p>
                    <Separator className="my-4" />
                    <Button 
                        onClick={handleJoinGroup} 
                        className="w-full py-3 text-base md:text-lg lg:text-xl">
                        Gruba Gir
                    </Button>
                </CardContent>
                <CardFooter className="text-center">


                </CardFooter>
            </Card>
        </div>
        </section>


    );
}
