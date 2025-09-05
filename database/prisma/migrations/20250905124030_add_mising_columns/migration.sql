-- CreateEnum
CREATE TYPE "BeerFormat" AS ENUM ('cl_25', 'cl_33', 'cl_44', 'cl_50', 'cl_75');

-- AlterTable
ALTER TABLE "beer" ADD COLUMN     "beer_format" "BeerFormat" NOT NULL DEFAULT 'cl_25',
ADD COLUMN     "description" TEXT;
