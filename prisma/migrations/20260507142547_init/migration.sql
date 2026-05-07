-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fisherman" (
    "id" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,

    CONSTRAINT "Fisherman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FishSpecies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localName" TEXT NOT NULL,
    "scientificName" TEXT,
    "category" TEXT,
    "imageUrl" TEXT,
    "family" TEXT,
    "habitat" TEXT,
    "length" DOUBLE PRECISION,
    "trophicLevel" DOUBLE PRECISION,
    "status" TEXT,

    CONSTRAINT "FishSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Catch" (
    "id" TEXT NOT NULL,
    "fishermanId" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "weatherCondition" TEXT,
    "temperature" DOUBLE PRECISION,
    "windSpeed" DOUBLE PRECISION,
    "tideLevel" TEXT,

    CONSTRAINT "Catch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatchDetail" (
    "id" TEXT NOT NULL,
    "catchId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CatchDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "format" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ReportTemplate_name_key" ON "ReportTemplate"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fisherman" ADD CONSTRAINT "Fisherman_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catch" ADD CONSTRAINT "Catch_fishermanId_fkey" FOREIGN KEY ("fishermanId") REFERENCES "Fisherman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catch" ADD CONSTRAINT "Catch_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchDetail" ADD CONSTRAINT "CatchDetail_catchId_fkey" FOREIGN KEY ("catchId") REFERENCES "Catch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatchDetail" ADD CONSTRAINT "CatchDetail_fishId_fkey" FOREIGN KEY ("fishId") REFERENCES "FishSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
