'use client';
import { Image } from '@/imports/Nextjs_imports';
import { useEffect } from 'react';
import { TableRow, TableCell, Badge, Skeleton } from '@/imports/Shadcn_imports';
import { useBroadcastMetrics } from '@/services/broadcast';
import { toast } from 'sonner';
import { formatDate, calculateDuration, formatNumber } from '@/utils/utilFuncs';
import { Loader } from 'lucide-react';
import DefaultThumbnail from '@/app/assets/default-video-thumbnail.jpg';

export default function BroadCastCell({ broadcast }: { broadcast: any }) {
  const {
    data: metrics,
    isError,
    isLoading,
  } = useBroadcastMetrics(broadcast.id, 'metrics', 300000);

  useEffect(() => {
    if (isError) {
      console.error('Error while fetching broadcast metrics: ', isError);
    }
  }, [isError]);

  const renderMetric = (value: any) => {
    if (isLoading) {
      return <Skeleton className="w-8 h-6" />;
    }
    return formatNumber(value) || 'N/A';
  };

  return (
    <TableRow>
      <TableCell className="font-medium w-40 text-center">
        {broadcast.title || 'Untitled'}
      </TableCell>
      <TableCell className="font-medium">
        <Image
          src={broadcast.thumbnail || DefaultThumbnail}
          alt={`Thumbnail for ${broadcast.title || 'broadcast'}`}
          className="rounded-md text-center"
          width={100}
          height={56}
        />
      </TableCell>
      <TableCell className="text-center">
        {formatDate(broadcast.createdAt) || 'N/A'}
      </TableCell>
      <TableCell className="hidden md:table-cell text-center">
        {calculateDuration(broadcast.createdAt, broadcast.completedAt) || 'N/A'}
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="default">{broadcast.privacyStatus || 'Unknown'}</Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="default">{broadcast.status || 'Unknown'}</Badge>
      </TableCell>
      <TableCell className="text-center">
        {renderMetric(metrics?.viewCount)}
      </TableCell>
      <TableCell className="text-center">
        {renderMetric(metrics?.commentCount)}
      </TableCell>
      <TableCell className="text-center">
        {renderMetric(metrics?.likeCount)}
      </TableCell>
    </TableRow>
  );
}
