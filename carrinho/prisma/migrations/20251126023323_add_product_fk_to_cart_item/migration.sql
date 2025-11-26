-- AddForeignKey
ALTER TABLE "product_id" ADD CONSTRAINT "product_id_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
