/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `brewery_owner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "brewery_owner_email_key" ON "brewery_owner"("email");
