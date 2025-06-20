/*
  Warnings:

  - The `taproom_hours` column on the `brewery_detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `opening_hours` on the `brewery_detail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "brewery_detail" DROP COLUMN "taproom_hours",
ADD COLUMN     "taproom_hours" JSONB,
DROP COLUMN "opening_hours",
ADD COLUMN     "opening_hours" JSONB NOT NULL;
