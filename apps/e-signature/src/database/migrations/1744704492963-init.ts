import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744704492963 implements MigrationInterface {
    name = 'Init1744704492963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" ADD "templatesId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" ADD CONSTRAINT "UQ_08c8a8e1dffcf7a9ab0adfb4a7d" UNIQUE ("templatesId")`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" ADD CONSTRAINT "FK_08c8a8e1dffcf7a9ab0adfb4a7d" FOREIGN KEY ("templatesId") REFERENCES "esign"."request_e_sign"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" DROP CONSTRAINT "FK_08c8a8e1dffcf7a9ab0adfb4a7d"`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" DROP CONSTRAINT "UQ_08c8a8e1dffcf7a9ab0adfb4a7d"`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" DROP COLUMN "templatesId"`);
    }

}
