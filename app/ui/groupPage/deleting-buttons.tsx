'use client'

import { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { deleteGroup, deleteTheMatches } from "@/app/lib/action"

export default function DeleteButtons({ groupId }: { groupId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isResetting, setIsResetting] = useState(false)

    const handleDeleteMatches = async () => {
        setIsResetting(true)
        try {
            await deleteTheMatches(groupId)
        } catch (error) {
            console.error('Failed to delete matches:', error)
        } finally {
            setIsResetting(false)
        }
    }

    const handleDeleteGroup = async () => {
        setIsDeleting(true)
        try {
            await deleteGroup(groupId)
        } catch (error) {
            console.error('Failed to delete group:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="w-full flex flex-row">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-1/2 mr-2" disabled={isResetting}>
                        {isResetting ? 'Sıfırlanıyor...' : 'Sıfırla'}
                    </Button> 
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Maçları silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Maçları silerseniz bunun geri dönüşü olmayacaktır. Bütün tercihler sıfırlanacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal Et</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMatches}>Maçları Sıfırla</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-1/2" variant='destructive' disabled={isDeleting}>
                        {isDeleting ? 'Siliniyor...' : 'Grubu Sil'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Grubu silmek istediğinize emin misiniz?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Grubu silerseniz bunun geri dönüşü olmayacaktır. Grup ve grup tercihleri silincektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal Et</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGroup}>Grubu Sil</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}