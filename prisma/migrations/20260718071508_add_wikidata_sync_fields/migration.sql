-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3),
ADD COLUMN     "wikidataId" TEXT;
