/*
  Warnings:

  - You are about to drop the column `district` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `districtId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `divisionId` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `upazila` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `upazilaId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `county` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCounty` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ward` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Address_division_district_upazila_idx";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "district",
DROP COLUMN "districtId",
DROP COLUMN "division",
DROP COLUMN "divisionId",
DROP COLUMN "upazila",
DROP COLUMN "upazilaId",
ADD COLUMN     "county" TEXT NOT NULL,
ADD COLUMN     "countyId" TEXT,
ADD COLUMN     "subCounty" TEXT NOT NULL,
ADD COLUMN     "subCountyId" TEXT,
ADD COLUMN     "ward" TEXT NOT NULL,
ADD COLUMN     "wardId" TEXT;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 minutes';

-- CreateIndex
CREATE INDEX "Address_county_subCounty_ward_idx" ON "Address"("county", "subCounty", "ward");
