/*
  Warnings:

  - The primary key for the `brewery_owner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birth_date` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `brewery_owner` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `brewery_owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,address_id]` on the table `brewery_owner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `brewery_owner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "brewery" DROP CONSTRAINT "brewery_brewery_owner_id_foreign";

-- DropIndex
DROP INDEX "brewery_owner_email_key";

-- AlterTable
ALTER TABLE "brewery" ADD COLUMN     "brewery_ownerAddress_id" UUID,
ADD COLUMN     "brewery_ownerUser_id" UUID;

-- AlterTable
ALTER TABLE "brewery_owner" DROP CONSTRAINT "brewery_owner_pkey",
DROP COLUMN "birth_date",
DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "first_name",
DROP COLUMN "id",
DROP COLUMN "last_name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
DROP COLUMN "role",
DROP COLUMN "updated_at",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brewery_owner_user_id_address_id_key" ON "brewery_owner"("user_id", "address_id");

-- AddForeignKey
ALTER TABLE "brewery" ADD CONSTRAINT "brewery_user_id_foreign" FOREIGN KEY ("brewery_owner_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery" ADD CONSTRAINT "brewery_brewery_ownerUser_id_brewery_ownerAddress_id_fkey" FOREIGN KEY ("brewery_ownerUser_id", "brewery_ownerAddress_id") REFERENCES "brewery_owner"("user_id", "address_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brewery_owner" ADD CONSTRAINT "brewery_owner_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
