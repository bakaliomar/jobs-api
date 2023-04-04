/*
  Warnings:

  - Added the required column `anounce` to the `concours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "concours" ADD COLUMN     "anounce" TEXT NOT NULL;
