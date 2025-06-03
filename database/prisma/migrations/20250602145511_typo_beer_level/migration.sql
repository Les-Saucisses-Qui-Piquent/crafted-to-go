/*
  Warnings:

  - You are about to drop the column `beer_level` on the `beer_style` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "beer_style" DROP COLUMN "beer_level",
ADD COLUMN     "beer_levels" INTEGER[];
