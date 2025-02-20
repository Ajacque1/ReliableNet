-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- Create User table first since it's referenced by other tables
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on User email
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- Create ISPMetrics table since it's referenced by ComplexISP
CREATE TABLE "public"."ISPMetrics" (
    "id" TEXT NOT NULL,
    "isp" TEXT NOT NULL,
    "avgDownload" DOUBLE PRECISION NOT NULL,
    "avgUpload" DOUBLE PRECISION NOT NULL,
    "avgPing" DOUBLE PRECISION NOT NULL,
    "testCount" INTEGER NOT NULL,
    "peakHourAvgDown" DOUBLE PRECISION,
    "peakHourAvgUp" DOUBLE PRECISION,
    "peakHourAvgPing" DOUBLE PRECISION,
    "offPeakAvgDown" DOUBLE PRECISION,
    "offPeakAvgUp" DOUBLE PRECISION,
    "offPeakAvgPing" DOUBLE PRECISION,
    "reliability" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ISPMetrics_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on ISPMetrics
CREATE UNIQUE INDEX "ISPMetrics_isp_city_state_country_key" ON "public"."ISPMetrics"("isp", "city", "state", "country");

-- CreateTable for ApartmentComplex
CREATE TABLE "public"."ApartmentComplex" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "website" TEXT,
    "amenities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApartmentComplex_pkey" PRIMARY KEY ("id")
);

-- CreateTable for SpeedTest
CREATE TABLE "public"."SpeedTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "downloadSpeed" DOUBLE PRECISION NOT NULL,
    "uploadSpeed" DOUBLE PRECISION NOT NULL,
    "ping" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asn" TEXT,
    "city" TEXT,
    "country" TEXT,
    "isp" TEXT,
    "ispOrg" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "state" TEXT,
    "zip" TEXT,
    "complexId" TEXT,

    CONSTRAINT "SpeedTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ApartmentReview
CREATE TABLE "public"."ApartmentReview" (
    "id" TEXT NOT NULL,
    "complexId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "internetRating" INTEGER NOT NULL,
    "comment" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApartmentReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable for ComplexISP
CREATE TABLE "public"."ComplexISP" (
    "id" TEXT NOT NULL,
    "complexId" TEXT NOT NULL,
    "ispMetricId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "coverage" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "speedTests" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplexISP_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE INDEX "SpeedTest_userId_idx" ON "public"."SpeedTest"("userId");
CREATE INDEX "SpeedTest_city_state_idx" ON "public"."SpeedTest"("city", "state");
CREATE INDEX "SpeedTest_latitude_longitude_idx" ON "public"."SpeedTest"("latitude", "longitude");
CREATE INDEX "SpeedTest_isp_idx" ON "public"."SpeedTest"("isp");

CREATE INDEX "ApartmentComplex_city_state_idx" ON "public"."ApartmentComplex"("city", "state");
CREATE INDEX "ApartmentComplex_latitude_longitude_idx" ON "public"."ApartmentComplex"("latitude", "longitude");

CREATE INDEX "ApartmentReview_complexId_idx" ON "public"."ApartmentReview"("complexId");
CREATE INDEX "ApartmentReview_userId_idx" ON "public"."ApartmentReview"("userId");

CREATE UNIQUE INDEX "ComplexISP_complexId_ispMetricId_key" ON "public"."ComplexISP"("complexId", "ispMetricId");
CREATE INDEX "ComplexISP_complexId_idx" ON "public"."ComplexISP"("complexId");
CREATE INDEX "ComplexISP_ispMetricId_idx" ON "public"."ComplexISP"("ispMetricId");

-- AddForeignKey
ALTER TABLE "public"."SpeedTest" 
ADD CONSTRAINT "SpeedTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "SpeedTest_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "public"."ApartmentComplex"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."ApartmentReview" 
ADD CONSTRAINT "ApartmentReview_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "public"."ApartmentComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "ApartmentReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."ComplexISP" 
ADD CONSTRAINT "ComplexISP_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "public"."ApartmentComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "ComplexISP_ispMetricId_fkey" FOREIGN KEY ("ispMetricId") REFERENCES "public"."ISPMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 