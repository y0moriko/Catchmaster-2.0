-- AlterTable
ALTER TABLE "Catch" ADD COLUMN "temperature" REAL;
ALTER TABLE "Catch" ADD COLUMN "tideLevel" TEXT;
ALTER TABLE "Catch" ADD COLUMN "weatherCondition" TEXT;
ALTER TABLE "Catch" ADD COLUMN "windSpeed" REAL;

-- CreateTable
CREATE TABLE "ReportTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "format" TEXT NOT NULL,
    "config" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportTemplate_name_key" ON "ReportTemplate"("name");
