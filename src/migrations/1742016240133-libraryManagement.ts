import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryManagement1742016240133 implements MigrationInterface {
    name = 'LibraryManagement1742016240133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_books_book" ("userId" integer NOT NULL, "bookId" integer NOT NULL, CONSTRAINT "PK_baef78b64f8672af581fb995802" PRIMARY KEY ("userId", "bookId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad4911225f9d075e7af4dc2ced" ON "user_books_book" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_17480627c54e46bc745098954e" ON "user_books_book" ("bookId") `);
        await queryRunner.query(`ALTER TABLE "user_books_book" ADD CONSTRAINT "FK_ad4911225f9d075e7af4dc2cede" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_books_book" ADD CONSTRAINT "FK_17480627c54e46bc745098954e3" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_books_book" DROP CONSTRAINT "FK_17480627c54e46bc745098954e3"`);
        await queryRunner.query(`ALTER TABLE "user_books_book" DROP CONSTRAINT "FK_ad4911225f9d075e7af4dc2cede"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17480627c54e46bc745098954e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad4911225f9d075e7af4dc2ced"`);
        await queryRunner.query(`DROP TABLE "user_books_book"`);
    }

}
