/*
  Warnings:

  - Added the required column `reported_on` to the `Items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Items" ADD COLUMN     "reported_on" TEXT NOT NULL,
ALTER COLUMN "reported_at" SET DATA TYPE TEXT;
