/*
  Warnings:

  - You are about to drop the column `owner_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_owner_id_fkey";

-- DropIndex
DROP INDEX "cart_owner_id_key";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "owner_id";

-- DropTable
DROP TABLE "User";
