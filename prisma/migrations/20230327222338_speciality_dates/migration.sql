/*
  Warnings:

  - Added the required column `updateAt` to the `specialities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "specialities" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
