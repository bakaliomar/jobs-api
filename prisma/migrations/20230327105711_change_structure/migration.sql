/*
  Warnings:

  - The primary key for the `candidatures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `candidatures` table. All the data in the column will be lost.
  - You are about to drop the `_ConcourToGrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GradeToSpeciality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `grades` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `specialityId` to the `candidatures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ConcourToGrade" DROP CONSTRAINT "_ConcourToGrade_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConcourToGrade" DROP CONSTRAINT "_ConcourToGrade_B_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToSpeciality" DROP CONSTRAINT "_GradeToSpeciality_A_fkey";

-- DropForeignKey
ALTER TABLE "_GradeToSpeciality" DROP CONSTRAINT "_GradeToSpeciality_B_fkey";

-- AlterTable
ALTER TABLE "candidatures" DROP CONSTRAINT "candidatures_pkey",
DROP COLUMN "id",
ADD COLUMN     "specialityId" UUID NOT NULL,
ADD CONSTRAINT "candidatures_pkey" PRIMARY KEY ("concourId", "userId", "specialityId");

-- AlterTable
ALTER TABLE "concours" ALTER COLUMN "location" DROP NOT NULL;

-- DropTable
DROP TABLE "_ConcourToGrade";

-- DropTable
DROP TABLE "_GradeToSpeciality";

-- DropTable
DROP TABLE "grades";

-- CreateTable
CREATE TABLE "concour_specialities_speciality" (
    "concourId" UUID NOT NULL,
    "specialityId" UUID NOT NULL,

    CONSTRAINT "concour_specialities_speciality_pkey" PRIMARY KEY ("concourId","specialityId")
);

-- CreateIndex
CREATE INDEX "cnc_id_idx" ON "concour_specialities_speciality"("concourId");

-- CreateIndex
CREATE INDEX "spc_id_idx" ON "concour_specialities_speciality"("specialityId");

-- CreateIndex
CREATE INDEX "cnd_cnc_id_idx" ON "candidatures"("concourId");

-- CreateIndex
CREATE INDEX "cnd_etbl_idx" ON "candidatures"("establishment");

-- CreateIndex
CREATE INDEX "frst_nm_idx" ON "users"("firstName");

-- CreateIndex
CREATE INDEX "lst_nm_idx" ON "users"("lastName");

-- CreateIndex
CREATE INDEX "eml_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "cin_idx" ON "users"("cin");

-- AddForeignKey
ALTER TABLE "concour_specialities_speciality" ADD CONSTRAINT "concour_specialities_speciality_concourId_fkey" FOREIGN KEY ("concourId") REFERENCES "concours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concour_specialities_speciality" ADD CONSTRAINT "concour_specialities_speciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
