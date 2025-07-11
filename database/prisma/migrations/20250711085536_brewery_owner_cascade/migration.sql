-- DropForeignKey
ALTER TABLE "brewery_owner" DROP CONSTRAINT "brewery_owner_address_id_foreign";

-- DropForeignKey
ALTER TABLE "brewery_owner" DROP CONSTRAINT "brewery_owner_user_id_foreign";

-- AddForeignKey
ALTER TABLE "brewery_owner" ADD CONSTRAINT "brewery_owner_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "brewery_owner" ADD CONSTRAINT "brewery_owner_address_id_foreign" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
