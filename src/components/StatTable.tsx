import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/imports/Shadcn_imports';
import { Eye, ThumbsUp, MessageSquareQuote } from 'lucide-react';
import { useBroadcastMetrics } from '@/services/broadcast';
import { Skeleton } from './ui/skeleton';
import { formatNumber } from '@/utils/utilFuncs';

export default function StatTable({ broadCastId }: { broadCastId: string }) {
  const {
    data: metrices,
    isError: metricError,
    isLoading: metricsLoading,
  } = useBroadcastMetrics(broadCastId, 'metrics', 10000);

  const {
    data: streamData,
    isError: streamDataError,
    isLoading: streamDataLoading,
  } = useBroadcastMetrics(broadCastId, 'stream', 10000);

  // Handle errors by logging them and providing fallback data
  if (metricError) {
    console.error('Error While Fetching Metric Data:', metricError);
  }

  if (streamDataError) {
    console.error('Error While Fetching Stream Data:', streamDataError);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stat</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>No.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">
            <span className="ml-2 absolute left-4 h-2 w-2 bg-red-500 rounded-full animate-blink"></span>
          </TableCell>
          <TableCell className="font-medium">Current Viewers</TableCell>
          <TableCell>
            {streamDataLoading ? (
              <Skeleton className="w-8 h-6" />
            ) : streamDataError ? (
              'N/A'
            ) : (
              formatNumber(
                streamData?.liveStreamingDetails?.concurrentViewers
              ) ?? 'N/A'
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">
            <Eye />
          </TableCell>
          <TableCell className="font-medium">Views</TableCell>
          <TableCell>
            {metricsLoading ? (
              <Skeleton className="w-8 h-6" />
            ) : metricError ? (
              'N/A'
            ) : (
              formatNumber(metrices?.viewCount) ?? 'N/A'
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">
            <ThumbsUp />
          </TableCell>
          <TableCell className="font-medium">Likes</TableCell>
          <TableCell>
            {metricsLoading ? (
              <Skeleton className="w-8 h-6" />
            ) : metricError ? (
              'N/A'
            ) : (
              formatNumber(metrices?.likeCount) ?? 'N/A'
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell className="font-medium">
            <MessageSquareQuote />
          </TableCell>
          <TableCell className="font-medium">Comments</TableCell>
          <TableCell>
            {metricsLoading ? (
              <Skeleton className="w-8 h-6" />
            ) : metricError ? (
              'N/A'
            ) : (
              formatNumber(metrices?.commentCount) ?? 'N/A'
            )}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
