-- AlterTable
ALTER TABLE "public"."ApartmentReview" ADD COLUMN "flagged" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "flaggedAt" TIMESTAMP(3),
    ADD COLUMN "flaggedBy" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ApartmentReview" ADD CONSTRAINT "ApartmentReview_flaggedBy_fkey" FOREIGN KEY ("flaggedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "ApartmentReview_flaggedBy_idx" ON "public"."ApartmentReview"("flaggedBy"); 