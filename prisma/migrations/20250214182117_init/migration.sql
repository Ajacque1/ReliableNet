-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateTable
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

    CONSTRAINT "SpeedTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "public"."ISPReview" (
    "id" TEXT NOT NULL,
    "ispMetricId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "notHelpful" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ISPReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ISPCoverage" (
    "id" TEXT NOT NULL,
    "ispMetricId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "signalStrength" DOUBLE PRECISION NOT NULL,
    "technology" TEXT NOT NULL,
    "maxSpeed" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ISPCoverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpeedTest_userId_idx" ON "public"."SpeedTest"("userId");

-- CreateIndex
CREATE INDEX "SpeedTest_city_state_idx" ON "public"."SpeedTest"("city", "state");

-- CreateIndex
CREATE INDEX "SpeedTest_latitude_longitude_idx" ON "public"."SpeedTest"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "SpeedTest_isp_idx" ON "public"."SpeedTest"("isp");

-- CreateIndex
CREATE INDEX "ISPMetrics_isp_idx" ON "public"."ISPMetrics"("isp");

-- CreateIndex
CREATE INDEX "ISPMetrics_city_state_idx" ON "public"."ISPMetrics"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "ISPMetrics_isp_city_state_country_key" ON "public"."ISPMetrics"("isp", "city", "state", "country");

-- CreateIndex
CREATE INDEX "ISPReview_ispMetricId_idx" ON "public"."ISPReview"("ispMetricId");

-- CreateIndex
CREATE INDEX "ISPReview_userId_idx" ON "public"."ISPReview"("userId");

-- CreateIndex
CREATE INDEX "ISPCoverage_latitude_longitude_idx" ON "public"."ISPCoverage"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "ISPCoverage_ispMetricId_idx" ON "public"."ISPCoverage"("ispMetricId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."SpeedTest" ADD CONSTRAINT "SpeedTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ISPReview" ADD CONSTRAINT "ISPReview_ispMetricId_fkey" FOREIGN KEY ("ispMetricId") REFERENCES "public"."ISPMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ISPReview" ADD CONSTRAINT "ISPReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ISPCoverage" ADD CONSTRAINT "ISPCoverage_ispMetricId_fkey" FOREIGN KEY ("ispMetricId") REFERENCES "public"."ISPMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
