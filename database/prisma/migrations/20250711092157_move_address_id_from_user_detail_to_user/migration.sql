/*
  Warnings:

  - You are about to drop the column `brewery_ownerAddress_id` on the `brewery` table. All the data in the column will be lost.
  - You are about to drop the column `brewery_ownerUser_id` on the `brewery` table. All the data in the column will be lost.
  - You are about to drop the column `brewery_owner_id` on the `brewery` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `user_detail` table. All the data in the column will be lost.
  - You are about to drop the `brewery_owner` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `owner_id` to the `brewery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "brewery" DROP CONSTRAINT "brewery_brewery_ownerUser_id_brewery_ownerAddress_id_fkey";

-- DropForeignKey
ALTER TABLE "brewery" DROP CONSTRAINT "brewery_user_id_foreign";

-- DropForeignKey
ALTER TABLE "brewery_owner" DROP CONSTRAINT "brewery_owner_address_id_foreign";

-- DropForeignKey
ALTER TABLE "brewery_owner" DROP CONSTRAINT "brewery_owner_user_id_foreign";

-- DropForeignKey
ALTER TABLE "user_detail" DROP CONSTRAINT "user_detail_address_id_foreign";

-- AlterTable
ALTER TABLE "brewery" DROP COLUMN "brewery_ownerAddress_id",
DROP COLUMN "brewery_ownerUser_id",
DROP COLUMN "brewery_owner_id",
ADD COLUMN     "owner_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user_detail" DROP COLUMN "address_id";

-- DropTable
DROP TABLE "brewery_owner";

-- AddForeignKey
ALTER TABLE "brewery" ADD CONSTRAINT "brewery_owner_user_id_foreign" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_detail_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
