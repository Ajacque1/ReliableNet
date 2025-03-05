/*
  Warnings:

  - You are about to drop the column `helpful` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `notHelpful` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `helpful` on the `Tip` table. All the data in the column will be lost.
  - You are about to drop the column `notHelpful` on the `Tip` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."FAQ_category_idx";

-- AlterTable
ALTER TABLE "public"."FAQ" DROP COLUMN "helpful",
DROP COLUMN "notHelpful",
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unhelpfulCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."Tip" DROP COLUMN "helpful",
DROP COLUMN "notHelpful",
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unhelpfulCount" INTEGER NOT NULL DEFAULT 0;
