-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CandidatureState" AS ENUM ('UNTREATED', 'SHORTLISTED', 'REFUSED', 'ADMITTED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT,
    "password" TEXT,
    "hashedRt" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "title" TEXT,
    "cin" TEXT NOT NULL,
    "phone" TEXT,
    "firstNameArabic" TEXT,
    "lastNameArabic" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthPlace" TEXT,
    "birthPlaceArabic" TEXT,
    "address" TEXT,
    "addressArabic" TEXT,
    "city" TEXT,
    "cityArabic" TEXT,
    "codePostal" TEXT,
    "roles" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concours" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "positionsNumber" INTEGER NOT NULL,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "concourDate" TIMESTAMP(3) NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    "anounce" TEXT NOT NULL,

    CONSTRAINT "concours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concour_specialities_speciality" (
    "concourId" UUID NOT NULL,
    "specialityId" UUID NOT NULL,

    CONSTRAINT "concour_specialities_speciality_pkey" PRIMARY KEY ("concourId","specialityId")
);

-- CreateTable
CREATE TABLE "candidatures" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "currentJob" TEXT,
    "graduationYear" INTEGER NOT NULL,
    "graduationCountry" TEXT NOT NULL,
    "establishment" TEXT NOT NULL,
    "establishmentName" TEXT NOT NULL,
    "degreeLevel" TEXT NOT NULL,
    "degreeSpeciality" TEXT NOT NULL,
    "degreeTitle" TEXT NOT NULL,
    "state" "CandidatureState" NOT NULL DEFAULT 'UNTREATED',
    "motive" TEXT,
    "isArchived" BOOLEAN NOT NULL,
    "dossierLink" TEXT NOT NULL,
    "concourId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "specialityId" UUID NOT NULL,

    CONSTRAINT "candidatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialities" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_cin_key" ON "users"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "frst_nm_idx" ON "users"("firstName");

-- CreateIndex
CREATE INDEX "lst_nm_idx" ON "users"("lastName");

-- CreateIndex
CREATE INDEX "eml_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "cin_idx" ON "users"("cin");

-- CreateIndex
CREATE INDEX "cnc_id_idx" ON "concour_specialities_speciality"("concourId");

-- CreateIndex
CREATE INDEX "spc_id_idx" ON "concour_specialities_speciality"("specialityId");

-- CreateIndex
CREATE INDEX "cnd_cnc_id_idx" ON "candidatures"("concourId");

-- CreateIndex
CREATE INDEX "cnd_etbl_idx" ON "candidatures"("establishment");

-- CreateIndex
CREATE UNIQUE INDEX "candidatures_userId_specialityId_concourId_key" ON "candidatures"("userId", "specialityId", "concourId");

-- CreateIndex
CREATE UNIQUE INDEX "specialities_name_key" ON "specialities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "specialities_nameArabic_key" ON "specialities"("nameArabic");

-- AddForeignKey
ALTER TABLE "concour_specialities_speciality" ADD CONSTRAINT "concour_specialities_speciality_concourId_fkey" FOREIGN KEY ("concourId") REFERENCES "concours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concour_specialities_speciality" ADD CONSTRAINT "concour_specialities_speciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_concourId_fkey" FOREIGN KEY ("concourId") REFERENCES "concours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidatures" ADD CONSTRAINT "candidatures_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "specialities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
