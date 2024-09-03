'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

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
        <div className='mb-4'>
        <Button onClick={handleCopyLink} variant="outline">
            {copied ? (
                <>
                    Link Kopyalandı!
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
