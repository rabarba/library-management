import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryManagement1742017046856 implements MigrationInterface {
    name = 'LibraryManagement1742017046856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_book" ("id" SERIAL NOT NULL, "score" integer, "userId" integer, "bookId" integer, CONSTRAINT "PK_3fdacff8af7da81a1cab6bc9f17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_ab47037d446ad35a3437ad77170" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_book" ADD CONSTRAINT "FK_82b430d61bfdb4e840329b48170" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_82b430d61bfdb4e840329b48170"`);
        await queryRunner.query(`ALTER TABLE "user_book" DROP CONSTRAINT "FK_ab47037d446ad35a3437ad77170"`);
        await queryRunner.query(`DROP TABLE "user_book"`);
    }

}
