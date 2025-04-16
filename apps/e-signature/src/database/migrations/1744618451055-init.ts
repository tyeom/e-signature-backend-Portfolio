import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744618451055 implements MigrationInterface {
    name = 'Init1744618451055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" RENAME COLUMN "fileName" TO "attachedFiles"`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" ADD "status" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" RENAME COLUMN "attachedFiles" TO "fileName"`);
    }

}
