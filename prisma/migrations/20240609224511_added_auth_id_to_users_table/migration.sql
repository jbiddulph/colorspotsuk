/*
  Warnings:

  - You are about to drop the column `created_at` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Items` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `Items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,8)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `Items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,8)` to `DoublePrecision`.
  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.
  - Made the column `item_description` on table `Items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_pic` on table `Items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_type` on table `Items` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `auth_id` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_user_id_fkey";

-- DropIndex
DROP INDEX "Items_user_id_idx";

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ALTER COLUMN "item_description" SET NOT NULL,
ALTER COLUMN "item_pic" SET NOT NULL,
ALTER COLUMN "item_type" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "created_at",
DROP COLUMN "username",
ADD COLUMN     "auth_id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
