/*
  Warnings:

  - Added the required column `bornDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bornDate" TIMESTAMP(3) NOT NULL;
