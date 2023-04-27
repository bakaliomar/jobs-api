-- AlterTable
ALTER TABLE "candidatures" ADD COLUMN     "motive" TEXT;

-- AlterTable
ALTER TABLE "concours" ALTER COLUMN "description" DROP NOT NULL;
