/*
  Warnings:

  - You are about to alter the column `format` on the `File` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "format" SET DATA TYPE VARCHAR(255);
