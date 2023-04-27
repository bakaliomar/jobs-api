/*
  Warnings:

  - Changed the type of `state` on the `candidatures` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CandidatureState" AS ENUM ('UNTREATED', 'SHORTLISTED', 'REFUSED', 'ADMITTED');

-- AlterTable
ALTER TABLE "candidatures" DROP COLUMN "state",
ADD COLUMN     "state" "CandidatureState" NOT NULL;
