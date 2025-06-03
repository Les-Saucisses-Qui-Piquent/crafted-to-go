/*
  Warnings:

  - Changed the type of `beer_level` on the `user_detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_detail" DROP COLUMN "beer_level",
ADD COLUMN     "beer_level" INTEGER NOT NULL;
