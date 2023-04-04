/*
  Warnings:

  - Added the required column `concourDate` to the `concours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionsNumber` to the `concours` table without a default value. This is not possible if the table is not empty.
  - Made the column `closingDate` on table `concours` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "concours" ADD COLUMN     "closed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "concourDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "positionsNumber" INTEGER NOT NULL,
ALTER COLUMN "closingDate" SET NOT NULL;
