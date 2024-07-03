-- CreateEnum
CREATE TYPE "privacyStatusEnum" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('ready', 'testing', 'live', 'complete');

-- CreateTable
CREATE TABLE "LiveStream" (
    "id" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" TEXT,
    "resolution" TEXT,
    "frameRate" TEXT,
    "ingestionAddress" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveStream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Broadcast" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "liveStreamId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "liveChatId" TEXT NOT NULL,
    "privacyStatus" "privacyStatusEnum" NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "status" "BroadcastStatus" NOT NULL,

    CONSTRAINT "Broadcast_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiveStream" ADD CONSTRAINT "LiveStream_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Broadcast" ADD CONSTRAINT "Broadcast_liveStreamId_fkey" FOREIGN KEY ("liveStreamId") REFERENCES "LiveStream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Broadcast" ADD CONSTRAINT "Broadcast_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
