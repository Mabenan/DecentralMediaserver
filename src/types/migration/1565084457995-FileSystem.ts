import {MigrationInterface, QueryRunner} from "typeorm";

export class FileSystem1565084457995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file_system` ADD `type` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `host` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `user` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `file_system` ADD `pass` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `pass`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `user`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `host`");
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `type`");
    }

}
