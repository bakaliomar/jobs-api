/*
  Warnings:

  - A unique constraint covering the columns `[userId,specialityId,concourId]` on the table `candidatures` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "candidatures" ALTER COLUMN "state" SET DEFAULT 'UNTREATED';

-- CreateIndex
CREATE UNIQUE INDEX "candidatures_userId_specialityId_concourId_key" ON "candidatures"("userId", "specialityId", "concourId");
