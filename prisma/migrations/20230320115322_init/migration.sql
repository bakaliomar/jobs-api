-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "cin" TEXT NOT NULL,
    "phone" TEXT,
    "firstNameArabic" TEXT,
    "lastNameArabic" TEXT,
    "birthDate" TEXT,
    "birthPlace" TEXT,
    "birthPlaceArabic" TEXT,
    "address" TEXT,
    "city" TEXT,
    "cityArabic" TEXT,
    "codePostal" TEXT,
    "roles" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "closingDate" TIMESTAMP(3),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidatures" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "currentJob" TEXT,
    "graduationYear" TIMESTAMP(3) NOT NULL,
    "graduationCountry" TEXT NOT NULL,
    "establishment" TEXT NOT NULL,
    "establishmentName" TEXT NOT NULL,
    "degreeLevel" TEXT NOT NULL,
    "degreeSpeciality" TEXT NOT NULL,
    "degreeTitle" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL,
    "dossierLink" TEXT NOT NULL,
    "jobId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "candidatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concours" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "concours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConcourToSpeciality" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_ConcourToJob" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cin_key" ON "users"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "specialities_name_key" ON "specialities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "concours_name_key" ON "concours"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ConcourToSpeciality_AB_unique" ON "_ConcourToSpeciality"("A", "B");

-- CreateIndex
CREATE INDEX "_ConcourToSpeciality_B_index" ON "_ConcourToSpeciality"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConcourToJob_AB_unique" ON "_ConcourToJob"("A", "B");

-- CreateIndex
CREATE INDEX "_ConcourToJob_B_index" ON "_ConcourToJob"("B");

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcourToSpeciality" ADD CONSTRAINT "_ConcourToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "concours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcourToSpeciality" ADD CONSTRAINT "_ConcourToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcourToJob" ADD CONSTRAINT "_ConcourToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "concours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConcourToJob" ADD CONSTRAINT "_ConcourToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
