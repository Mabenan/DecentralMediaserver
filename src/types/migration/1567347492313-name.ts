import {MigrationInterface, QueryRunner} from "typeorm";

export class name1567347492313 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `FK_4ad66eaf817fc6f530df9893967` ON `path_map`");
        await queryRunner.query("DROP INDEX `FK_98ae013e715e51390fe94254798` ON `file`");
        await queryRunner.query("DROP INDEX `FK_c74263b470588ceebd066a1a82d` ON `file`");
        await queryRunner.query("DROP INDEX `FK_ad440a56d327ee4eb8e5577669b` ON `file`");
        await queryRunner.query("ALTER TABLE `album` ADD `name` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `path_map` ADD CONSTRAINT `FK_4ad66eaf817fc6f530df9893967` FOREIGN KEY (`fileSystemId`) REFERENCES `file_system`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_98ae013e715e51390fe94254798` FOREIGN KEY (`albumId`) REFERENCES `album`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_c74263b470588ceebd066a1a82d` FOREIGN KEY (`fileSystemId`) REFERENCES `file_system`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `file` ADD CONSTRAINT `FK_ad440a56d327ee4eb8e5577669b` FOREIGN KEY (`dayDay`) REFERENCES `day`(`day`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_ad440a56d327ee4eb8e5577669b`");
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_c74263b470588ceebd066a1a82d`");
        await queryRunner.query("ALTER TABLE `file` DROP FOREIGN KEY `FK_98ae013e715e51390fe94254798`");
        await queryRunner.query("ALTER TABLE `path_map` DROP FOREIGN KEY `FK_4ad66eaf817fc6f530df9893967`");
        await queryRunner.query("ALTER TABLE `album` DROP COLUMN `name`");
        await queryRunner.query("CREATE INDEX `FK_ad440a56d327ee4eb8e5577669b` ON `file` (`dayDay`)");
        await queryRunner.query("CREATE INDEX `FK_c74263b470588ceebd066a1a82d` ON `file` (`fileSystemId`)");
        await queryRunner.query("CREATE INDEX `FK_98ae013e715e51390fe94254798` ON `file` (`albumId`)");
        await queryRunner.query("CREATE INDEX `FK_4ad66eaf817fc6f530df9893967` ON `path_map` (`fileSystemId`)");
    }

}
