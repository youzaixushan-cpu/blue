-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "caps" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "bio" TEXT NOT NULL,
    "recentRatings" JSONB NOT NULL,
    "career" JSONB NOT NULL,
    "avatarTheme" TEXT NOT NULL,
    "officialSquad" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,
    "opponentFlag" TEXT NOT NULL,
    "competition" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "scorers" JSONB NOT NULL,
    "lineup" JSONB NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunitySubmission" (
    "id" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT NOT NULL,

    CONSTRAINT "CommunitySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunitySubmissionMember" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "playerId" TEXT,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,

    CONSTRAINT "CommunitySubmissionMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerRankStat" (
    "playerId" TEXT NOT NULL,
    "lastRank" INTEGER NOT NULL,

    CONSTRAINT "PlayerRankStat_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "CommunitySubmissionLike" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunitySubmissionLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunitySubmission_ipHash_createdAt_idx" ON "CommunitySubmission"("ipHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommunitySubmissionLike_submissionId_ipHash_key" ON "CommunitySubmissionLike"("submissionId", "ipHash");

-- AddForeignKey
ALTER TABLE "CommunitySubmissionMember" ADD CONSTRAINT "CommunitySubmissionMember_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "CommunitySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunitySubmissionLike" ADD CONSTRAINT "CommunitySubmissionLike_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "CommunitySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
