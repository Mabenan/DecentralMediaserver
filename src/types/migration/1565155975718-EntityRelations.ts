import {MigrationInterface, QueryRunner} from "typeorm";

export class EntityRelations1565155975718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `path_map` (`id` int NOT NULL AUTO_INCREMENT, `ftpPath` varchar(255) NOT NULL, `webPath` varchar(255) NOT NULL, `fileSystemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `path_map` ADD CONSTRAINT `FK_4ad66eaf817fc6f530df9893967` FOREIGN KEY (`fileSystemId`) REFERENCES `file_system`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `path_map` DROP FOREIGN KEY `FK_4ad66eaf817fc6f530df9893967`");
        await queryRunner.query("DROP TABLE `path_map`");
    }

}
