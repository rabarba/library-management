import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryManagement1742017215219 implements MigrationInterface {
    name = 'LibraryManagement1742017215219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD "score" smallint`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD "score" integer`);
    }

}
