import {MigrationInterface, QueryRunner} from "typeorm";

export class Thumb1565350501319 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` DROP COLUMN `thumb`");
        await queryRunner.query("ALTER TABLE `file` ADD `thumb` blob NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file` DROP COLUMN `thumb`");
        await queryRunner.query("ALTER TABLE `file` ADD `thumb` varchar(255) NULL");
    }

}
