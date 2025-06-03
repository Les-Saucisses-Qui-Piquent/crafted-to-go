/*
  Warnings:

  - The `beer_levels` column on the `beer_color` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "beer_color" DROP COLUMN "beer_levels",
ADD COLUMN     "beer_levels" INTEGER[];
