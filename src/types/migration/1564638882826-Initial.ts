import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1564638882826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file_system` ADD `description` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `file_system` DROP COLUMN `description`");
    }

}
