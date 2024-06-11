/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_user_id_fkey";

-- AlterTable
ALTER TABLE "Items" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Users";
