/*
  Warnings:

  - Changed the type of `graduationYear` on the `candidatures` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "candidatures" DROP COLUMN "graduationYear",
ADD COLUMN     "graduationYear" INTEGER NOT NULL;
