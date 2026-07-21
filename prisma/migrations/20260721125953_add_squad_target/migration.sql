-- AlterTable
ALTER TABLE "CommunitySubmission" ADD COLUMN     "target" TEXT NOT NULL DEFAULT 'next';

-- AlterTable
ALTER TABLE "PlayerRankStat" DROP CONSTRAINT "PlayerRankStat_pkey",
ADD COLUMN     "target" TEXT NOT NULL DEFAULT 'next',
ADD CONSTRAINT "PlayerRankStat_pkey" PRIMARY KEY ("playerId", "target");

-- AlterTable
ALTER TABLE "UserSquad" DROP CONSTRAINT "UserSquad_pkey",
ADD COLUMN     "target" TEXT NOT NULL DEFAULT 'next',
ADD CONSTRAINT "UserSquad_pkey" PRIMARY KEY ("userId", "target");

-- CreateIndex
CREATE INDEX "CommunitySubmission_target_createdAt_idx" ON "CommunitySubmission"("target", "createdAt");
