/*
  Warnings:

  - You are about to drop the column `ARR_beer_level` on the `beer_color` table. All the data in the column will be lost.
  - You are about to drop the column `ARR_beer_level` on the `beer_style` table. All the data in the column will be lost.
  - You are about to drop the column `ARR_color` on the `user_detail` table. All the data in the column will be lost.
  - You are about to drop the column `ARR_style` on the `user_detail` table. All the data in the column will be lost.
  - You are about to drop the `beer_beer_style` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `updated_at` on table `address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `beer_style_ids` to the `beer` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `beer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `brewery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `brewery_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `brewery_owner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `order_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_detail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "beer_beer_style" DROP CONSTRAINT "beer_beer_style_beer_id_foreign";

-- DropForeignKey
ALTER TABLE "beer_beer_style" DROP CONSTRAINT "beer_beer_style_beer_style_id_foreign";

-- AlterTable
ALTER TABLE "address" ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "beer" ADD COLUMN     "beer_style_ids" UUID NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "beer_color" DROP COLUMN "ARR_beer_level",
ADD COLUMN     "beer_levels" VARCHAR(255)[];

-- AlterTable
ALTER TABLE "beer_style" DROP COLUMN "ARR_beer_level",
ADD COLUMN     "beer_level" VARCHAR(255)[];

-- AlterTable
ALTER TABLE "brewery" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "brewery_detail" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "brewery_owner" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "favorite_beer" ALTER COLUMN "liked_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "favorite_brewery" ALTER COLUMN "liked_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "order_detail" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "test" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "birth_date" SET DATA TYPE DATE,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_detail" DROP COLUMN "ARR_color",
DROP COLUMN "ARR_style",
ADD COLUMN     "color_ids" UUID[],
ADD COLUMN     "style_ids" UUID[],
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "beer_beer_style";

-- CreateTable
CREATE TABLE "_beer_colorTouser_detail" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_beer_colorTouser_detail_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_beer_styleTouser_detail" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_beer_styleTouser_detail_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_beer_colorTouser_detail_B_index" ON "_beer_colorTouser_detail"("B");

-- CreateIndex
CREATE INDEX "_beer_styleTouser_detail_B_index" ON "_beer_styleTouser_detail"("B");

-- AddForeignKey
ALTER TABLE "beer" ADD CONSTRAINT "beer_style" FOREIGN KEY ("beer_style_ids") REFERENCES "beer_style"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_beer_colorTouser_detail" ADD CONSTRAINT "_beer_colorTouser_detail_A_fkey" FOREIGN KEY ("A") REFERENCES "beer_color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beer_colorTouser_detail" ADD CONSTRAINT "_beer_colorTouser_detail_B_fkey" FOREIGN KEY ("B") REFERENCES "user_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beer_styleTouser_detail" ADD CONSTRAINT "_beer_styleTouser_detail_A_fkey" FOREIGN KEY ("A") REFERENCES "beer_style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_beer_styleTouser_detail" ADD CONSTRAINT "_beer_styleTouser_detail_B_fkey" FOREIGN KEY ("B") REFERENCES "user_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
