/*
  Warnings:

  - A unique constraint covering the columns `[parent_folder_id,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Folder_parent_folder_id_name_key" ON "Folder"("parent_folder_id", "name");
