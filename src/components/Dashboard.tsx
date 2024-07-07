'use client';
import { useSession, Image, Link } from '@/imports/Nextjs_imports';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/imports/Shadcn_imports';
import { useBroadcastMetrics } from '@/services/youtube';
import { toast } from 'sonner';
import { formatDate, calculateDuration } from '@/utils/dateUtils';
import { Loader, ThumbsUp, Eye, MessageSquareText } from 'lucide-react';
import Demo from '@/app/assets/backgrounds/bg2.png';

function BroadCastCell({ broadcast }: { broadcast: any }) {
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
    <TableRow >
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

export default function Dashboard({
  buttonRef,
  broadcasts,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
  broadcasts: any;
}) {
  const session = useSession();

  return (
    <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <VideoIcon className="h-6 w-6" />
              <span className="">InstaLive</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <HomeIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
                prefetch={false}
              >
                <VideoIcon className="h-4 w-4" />
                Streams
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <UsersIcon className="h-4 w-4" />
                Viewers
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                prefetch={false}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => {
                buttonRef.current?.click();
              }}
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Create New Stream</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <SettingsIcon className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Image
                    // @ts-ignore
                    src={session?.data?.user.image}
                    width={32}
                    height={32}
                    className="rounded-full"
                    alt="Avatar"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Tech Talk</div>
                    <div className="text-sm text-muted-foreground">
                      June 15, 2023
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Game Night</div>
                    <div className="text-sm text-muted-foreground">
                      June 22, 2023
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Q&A Session</div>
                    <div className="text-sm text-muted-foreground">
                      July 1, 2023
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stream Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Total Viewers</div>
                      <div className="text-sm text-muted-foreground">
                        12,345
                      </div>
                    </div>
                    <UsersIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Peak Concurrent</div>
                      <div className="text-sm text-muted-foreground">2,345</div>
                    </div>
                    <GitGraphIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Average Duration</div>
                      <div className="text-sm text-muted-foreground">
                        45 minutes
                      </div>
                    </div>
                    <ClockIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Tech Talk</div>
                    <div className="text-sm text-muted-foreground">
                      June 10, 2023
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Game Night</div>
                    <div className="text-sm text-muted-foreground">
                      June 5, 2023
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Q&A Session</div>
                    <div className="text-sm text-muted-foreground">
                      May 25, 2023
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <CardTitle>Past Streams</CardTitle>

          <div className="border shadow-sm rounded-lg p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Title</TableHead>
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead className="min-w-[150px]">Date</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Duration
                  </TableHead>
                  <TableHead>Privacy Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Eye />
                  </TableHead>
                  <TableHead>
                    <MessageSquareText />
                  </TableHead>
                  <TableHead>
                    <ThumbsUp />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts.data.map((broadcast: any) => {
                  return <BroadCastCell broadcast={broadcast} key={broadcast.id} />;
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
// @ts-ignore
function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// @ts-ignore
function GitGraphIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="5" cy="6" r="3" />
      <path d="M5 9v6" />
      <circle cx="5" cy="18" r="3" />
      <path d="M12 3v18" />
      <circle cx="19" cy="6" r="3" />
      <path d="M16 15.7A9 9 0 0 0 19 9" />
    </svg>
  );
}

// @ts-ignore
function HomeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// @ts-ignore
function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

// @ts-ignore
function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// @ts-ignore
function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// @ts-ignore
function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}
