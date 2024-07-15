'use client';
import { Image } from '@/imports/Nextjs_imports';
import {
    TableRow,
    TableCell,
    Badge,
} from '@/imports/Shadcn_imports';
import { useBroadcastMetrics } from '@/services/youtube';
import { toast } from 'sonner';
import { formatDate, calculateDuration } from '@/utils/dateUtils';
import { Loader } from 'lucide-react';
import Demo from '@/app/assets/backgrounds/bg2.png';

export default function BroadCastCell({ broadcast }: { broadcast: any }) {
    const {
        data: metrices,
        isError,
        isLoading,
    } = useBroadcastMetrics(broadcast.id);

    if (isError) {
        toast('Metrices Error', {
            description: 'Error while fetching broadcast metrices',
            duration: 5000,
        });
    }

    return (
        <TableRow>
            <TableCell className="font-medium w-40 text-center">
                {broadcast.title}
            </TableCell>
            <TableCell className="font-medium">
                <Image
                    src={Demo || broadcast.thumbnail}
                    alt="Thumbnail not found"
                    className="rounded-md text-center"
                />
            </TableCell>
            <TableCell className="text-center">
                {formatDate(broadcast.createdAt)}
            </TableCell>
            <TableCell className="hidden md:table-cell text-center">
                {calculateDuration(broadcast.createdAt, broadcast.completedAt)}
            </TableCell>
            <TableCell className="text-center">
                <Badge variant="default">{broadcast.privacyStatus}</Badge>
            </TableCell>
            <TableCell className="text-center">
                <Badge variant="default">{broadcast.status}</Badge>
            </TableCell>
            <TableCell className="text-center">
                {isLoading ? <Loader className="animate-spin" /> : metrices.viewCount}
            </TableCell>
            <TableCell className="text-center">
                {isLoading ? (
                    <Loader className="animate-spin" />
                ) : (
                    metrices.commentCount
                )}
            </TableCell>
            <TableCell className="text-center">
                {isLoading ? <Loader className="animate-spin" /> : metrices.likeCount}
            </TableCell>
        </TableRow>
    );
}
