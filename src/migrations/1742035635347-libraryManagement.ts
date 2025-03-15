import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryManagement1742035635347 implements MigrationInterface {
    name = 'LibraryManagement1742035635347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "isAvailable" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "isAvailable"`);
    }

}
