/*
  Warnings:

  - A unique constraint covering the columns `[cart_id,product_id]` on the table `product_id` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_id_cart_id_product_id_key" ON "product_id"("cart_id", "product_id");
