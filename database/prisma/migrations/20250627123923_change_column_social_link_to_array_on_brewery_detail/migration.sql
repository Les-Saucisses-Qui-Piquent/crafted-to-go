/*
  Warnings:

  - You are about to drop the column `social_link` on the `brewery_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "brewery_detail" DROP COLUMN "social_link",
ADD COLUMN     "social_links" TEXT[];
