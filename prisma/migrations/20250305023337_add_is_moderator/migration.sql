/*
  Warnings:

  - Added the required column `reliabilityRating` to the `ISPReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speedRating` to the `ISPReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportRating` to the `ISPReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueRating` to the `ISPReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ISPReview" ADD COLUMN     "installationRating" INTEGER,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "moderationDate" TIMESTAMP(3),
ADD COLUMN     "moderationReason" TEXT,
ADD COLUMN     "moderationStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "moderatorId" TEXT,
ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "reliabilityRating" INTEGER NOT NULL,
ADD COLUMN     "speedRating" INTEGER NOT NULL,
ADD COLUMN     "supportRating" INTEGER NOT NULL,
ADD COLUMN     "valueRating" INTEGER NOT NULL,
ADD COLUMN     "verificationDate" TIMESTAMP(3),
ADD COLUMN     "verificationProof" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isModerator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "ISPReview_moderationStatus_idx" ON "public"."ISPReview"("moderationStatus");

-- AddForeignKey
ALTER TABLE "public"."ISPReview" ADD CONSTRAINT "ISPReview_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
