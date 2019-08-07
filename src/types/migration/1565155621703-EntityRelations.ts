import {MigrationInterface, QueryRunner} from "typeorm";

export class EntityRelations1565155621703 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `file` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NULL, `createdAt` datetime NULL, `ftpPath` varchar(255) NULL, `webPath` varchar(255) NULL, `albumId` int NULL, `fileSystemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `album` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `path`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `host`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `user`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `pass`");
        await queryRunner.query("ALTER TABLE `file_system` ADD `ftpHost` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `ftpUser` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `ftpPass` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `webHost` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file_system` CHANGE `title` `title` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file_system` CHANGE `type` `type` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_98ae013e715e51390fe94254798` FOREIGN KEY (`albumId`) REFERENCES `album`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_c74263b470588ceebd066a1a82d` FOREIGN KEY (`fileSystemId`) REFERENCES `file_system`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_c74263b470588ceebd066a1a82d`");
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_98ae013e715e51390fe94254798`");
        await queryRunner.query("ALTER TABLE `file_system` CHANGE `type` `type` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` CHANGE `title` `title` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `webHost`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `ftpPass`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `ftpUser`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `ftpHost`");
        await queryRunner.query("ALTER TABLE `file_system` ADD `pass` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `user` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `host` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `description` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `path` varchar(255) NOT NULL");
        await queryRunner.query("DROP TABLE `album`");
        await queryRunner.query("DROP TABLE `file`");
    }

}
