import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742426522750 implements MigrationInterface {
    name = 'Init1742426522750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD "sentDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD "status" character varying`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD "fileName" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP COLUMN "sentDate"`);
    }

}
