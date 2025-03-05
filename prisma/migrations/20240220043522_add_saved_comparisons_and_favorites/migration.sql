-- CreateTable
CREATE TABLE "public"."SavedComparison" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ispIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedComparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteComplex" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "complexId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteComplex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedComparison_userId_idx" ON "public"."SavedComparison"("userId");

-- CreateIndex
CREATE INDEX "FavoriteComplex_userId_idx" ON "public"."FavoriteComplex"("userId");

-- CreateIndex
CREATE INDEX "FavoriteComplex_complexId_idx" ON "public"."FavoriteComplex"("complexId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteComplex_userId_complexId_key" ON "public"."FavoriteComplex"("userId", "complexId");

-- AddForeignKey
ALTER TABLE "public"."SavedComparison" ADD CONSTRAINT "SavedComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteComplex" ADD CONSTRAINT "FavoriteComplex_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteComplex" ADD CONSTRAINT "FavoriteComplex_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "public"."ApartmentComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE; 