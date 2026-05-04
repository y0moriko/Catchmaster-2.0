-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Fisherman" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "barangay" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    CONSTRAINT "Fisherman_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FishSpecies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "localName" TEXT NOT NULL,
    "scientificName" TEXT,
    "category" TEXT,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "Catch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fishermanId" TEXT NOT NULL,
    "recordedBy" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    CONSTRAINT "Catch_fishermanId_fkey" FOREIGN KEY ("fishermanId") REFERENCES "Fisherman" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Catch_recordedBy_fkey" FOREIGN KEY ("recordedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CatchDetail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "catchId" TEXT NOT NULL,
    "fishId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "weight" REAL NOT NULL,
    CONSTRAINT "CatchDetail_catchId_fkey" FOREIGN KEY ("catchId") REFERENCES "Catch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CatchDetail_fishId_fkey" FOREIGN KEY ("fishId") REFERENCES "FishSpecies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
