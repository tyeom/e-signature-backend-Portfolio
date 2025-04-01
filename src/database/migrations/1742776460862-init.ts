import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742776460862 implements MigrationInterface {
    name = 'Init1742776460862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD "version" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" ADD "version" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."requestee" DROP COLUMN "version"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP COLUMN "version"`);
    }

}
