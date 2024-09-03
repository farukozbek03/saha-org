'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function CopyableLink({ groupId }: { groupId: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        const link = `${window.location.origin}/add?groupid=${groupId}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    return (
        <div className='mb-4 flex flex-col items-center text-center'>
            <p className='mb-2 text-sm font-bold text-primary'>Gruba davet etmek için linki kopyalayınız</p>

            <Button onClick={handleCopyLink} variant="outline" className='border-primary'>
                {copied ? (
                    <>
                        <CheckCircle className="mr-2" /> Link Kopyalandı!
                    </>
                ) : (
                    <>
                        Paylaşmak İçin Linki Kopyala
                    </>
                )}
            </Button>
        </div>
    );
}
