/*
  Warnings:

  - You are about to drop the column `paiement_method` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "payment_method" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "paiement_method";

-- AlterTable
ALTER TABLE "user_detail" ADD COLUMN     "payment_method" TEXT;
