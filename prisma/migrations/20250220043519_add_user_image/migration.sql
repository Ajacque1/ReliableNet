-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT;

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

-- CreateIndex
CREATE INDEX "ISPReview_ispMetricId_idx" ON "public"."ISPReview"("ispMetricId");

-- CreateIndex
CREATE INDEX "ISPReview_userId_idx" ON "public"."ISPReview"("userId");

-- CreateIndex
CREATE INDEX "ISPCoverage_latitude_longitude_idx" ON "public"."ISPCoverage"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "ISPCoverage_ispMetricId_idx" ON "public"."ISPCoverage"("ispMetricId");

-- CreateIndex
CREATE INDEX "ISPMetrics_isp_idx" ON "public"."ISPMetrics"("isp");

-- CreateIndex
CREATE INDEX "ISPMetrics_city_state_idx" ON "public"."ISPMetrics"("city", "state");

-- AddForeignKey
ALTER TABLE "public"."ISPReview" ADD CONSTRAINT "ISPReview_ispMetricId_fkey" FOREIGN KEY ("ispMetricId") REFERENCES "public"."ISPMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ISPReview" ADD CONSTRAINT "ISPReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ISPCoverage" ADD CONSTRAINT "ISPCoverage_ispMetricId_fkey" FOREIGN KEY ("ispMetricId") REFERENCES "public"."ISPMetrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
