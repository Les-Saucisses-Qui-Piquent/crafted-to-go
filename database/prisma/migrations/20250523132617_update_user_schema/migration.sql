/*
  Warnings:

  - You are about to drop the column `paiement_method` on the `user` table. All the data in the column will be lost.
  - Added the required column `payment_method` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('card', 'cash');

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "paiement_method",
ALTER COLUMN "birth_date" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_detail" ADD COLUMN     "payment_method" "PaymentMethod";
