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
import { fetchGroupName } from "@/app/lib/data"




export default function AddGroup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [groupName, setGroupName] = useState({ name: '', desc: '' });

    useEffect(() => {
        async function fetchData() {
            const groupId = searchParams.get('groupid');
            if (groupId) {
                const fetchedGroupName = await fetchGroupName(groupId);
                setGroupName(fetchedGroupName);
            } else {
                router.push('/dashboard');
            }
        }

        fetchData();
    }, [searchParams, router]);

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
                    {/* Additional footer content can go here */}
                </CardFooter>
            </Card>
        </div>
        </section>


    );
}
