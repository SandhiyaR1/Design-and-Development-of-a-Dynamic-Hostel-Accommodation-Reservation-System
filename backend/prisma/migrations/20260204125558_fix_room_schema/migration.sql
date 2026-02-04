/*
  Warnings:

  - You are about to drop the column `capacity` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `isAC` on the `room` table. All the data in the column will be lost.
  - You are about to alter the column `roomType` on the `room` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - A unique constraint covering the columns `[number,hostelId]` on the table `Floor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `room` DROP COLUMN `capacity`,
    DROP COLUMN `isAC`,
    ADD COLUMN `ac` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `roomType` ENUM('SINGLE', 'TWO_IN_ONE', 'FOUR_IN_ONE', 'EIGHT_IN_ONE', 'TEN_IN_ONE') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Floor_number_hostelId_key` ON `Floor`(`number`, `hostelId`);
