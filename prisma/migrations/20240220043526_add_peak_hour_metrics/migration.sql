-- AlterTable
ALTER TABLE "public"."ApartmentReview" 
ADD COLUMN "peakHourRating" INTEGER,
ADD COLUMN "peakHourComment" TEXT,
ADD COLUMN "peakHourStart" INTEGER, -- Hour of day (0-23)
ADD COLUMN "peakHourEnd" INTEGER, -- Hour of day (0-23)
ADD COLUMN "peakHourDownloadSpeed" DOUBLE PRECISION,
ADD COLUMN "peakHourUploadSpeed" DOUBLE PRECISION,
ADD COLUMN "peakHourPing" DOUBLE PRECISION,
ADD COLUMN "peakHourPacketLoss" DOUBLE PRECISION; 