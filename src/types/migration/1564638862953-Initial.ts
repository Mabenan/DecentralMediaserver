import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1564638862953 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `file_system` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `path` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `file_system`");
    }

}
