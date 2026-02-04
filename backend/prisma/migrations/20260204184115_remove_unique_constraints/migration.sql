-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_bedId_fkey`;

-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_userRegNo_fkey`;

-- DropIndex
DROP INDEX `Reservation_bedId_status_key` ON `reservation`;

-- DropIndex
DROP INDEX `Reservation_userRegNo_status_key` ON `reservation`;

-- AddForeignKey
ALTER TABLE `Bed` ADD CONSTRAINT `Bed_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userRegNo_fkey` FOREIGN KEY (`userRegNo`) REFERENCES `User`(`regNo`) ON DELETE RESTRICT ON UPDATE CASCADE;
