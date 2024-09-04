// org-table.tsx
import { fetchAvailability,fetchDisplayName,fetchFieldIdFromGroupFieldId,fetchFieldName} from "@/app/lib/data";
import { Result } from "@/app/lib/types";
import { findMostCommonTimeSlots } from "@/app/lib/utils";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { format } from 'date-fns';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  


export default async function OrgTable({ groupId }: { groupId: string }) {
    try {
        // promise all fetches
        const availability = await fetchAvailability(groupId);
        const commonTimeSlots = findMostCommonTimeSlots(availability);
        for (let i in commonTimeSlots) {
           commonTimeSlots[i].group_field_id = await fetchFieldName(commonTimeSlots[i].group_field_id);
           commonTimeSlots[i].user_ids = await fetchDisplayName(commonTimeSlots[i].user_ids)
        }
        return (
            <div className="flex w-full">
            <Table>
                
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Saha Adı</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead className="text-right">Kişi Sayısı</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {commonTimeSlots.slice(0,6).map((availability) => (
                        <TableRow key={availability.group_field_id}>
                            <TableCell className="font-medium">{availability.group_field_id}</TableCell>
                            <TableCell>{format(new Date(availability.date), 'dd/MM/yyyy')}</TableCell>
                            <TableCell>{availability.timeSlot}</TableCell>
                            <TableCell className="text-right">
                            <Popover>
                                <PopoverTrigger>{availability.count}</PopoverTrigger>
                                <PopoverContent className="w-auto">
                                    <ul>{availability.user_ids.map((name) => (
                                        <li key={name}>{name}</li>
                                ))}</ul></PopoverContent>
                            </Popover></TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            </div>
        );
    } catch (error) {
        console.error("Error in OrgTable:", error);
        return <div>Error loading availability data. Please try again later.</div>;
    }
}