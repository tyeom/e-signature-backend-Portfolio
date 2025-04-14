import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744602550796 implements MigrationInterface {
    name = 'Init1744602550796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."signature_teammates_user_master" ("signatureId" integer NOT NULL, "userMasterId" integer NOT NULL, CONSTRAINT "PK_319722d9ac1af10c24c0c64b88c" PRIMARY KEY ("signatureId", "userMasterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f12feaa6c0e1eddb9bf27973da" ON "esign"."signature_teammates_user_master" ("signatureId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d7b0843143d8b749373a558d09" ON "esign"."signature_teammates_user_master" ("userMasterId") `);
        await queryRunner.query(`CREATE TABLE "esign"."signature_stamp_teammates_user_master" ("signatureStampId" integer NOT NULL, "userMasterId" integer NOT NULL, CONSTRAINT "PK_5979f8a33c61ecb5cbacd2ed851" PRIMARY KEY ("signatureStampId", "userMasterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4cdbfa5a9d8a77992f05e9012a" ON "esign"."signature_stamp_teammates_user_master" ("signatureStampId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec1535862399740bddd3b213bb" ON "esign"."signature_stamp_teammates_user_master" ("userMasterId") `);
        await queryRunner.query(`ALTER TABLE "esign"."signature_teammates_user_master" ADD CONSTRAINT "FK_f12feaa6c0e1eddb9bf27973da6" FOREIGN KEY ("signatureId") REFERENCES "esign"."signature"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_teammates_user_master" ADD CONSTRAINT "FK_d7b0843143d8b749373a558d099" FOREIGN KEY ("userMasterId") REFERENCES "web"."UserMaster"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp_teammates_user_master" ADD CONSTRAINT "FK_4cdbfa5a9d8a77992f05e9012a4" FOREIGN KEY ("signatureStampId") REFERENCES "esign"."signature_stamp"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp_teammates_user_master" ADD CONSTRAINT "FK_ec1535862399740bddd3b213bbd" FOREIGN KEY ("userMasterId") REFERENCES "web"."UserMaster"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp_teammates_user_master" DROP CONSTRAINT "FK_ec1535862399740bddd3b213bbd"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp_teammates_user_master" DROP CONSTRAINT "FK_4cdbfa5a9d8a77992f05e9012a4"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_teammates_user_master" DROP CONSTRAINT "FK_d7b0843143d8b749373a558d099"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_teammates_user_master" DROP CONSTRAINT "FK_f12feaa6c0e1eddb9bf27973da6"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_ec1535862399740bddd3b213bb"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_4cdbfa5a9d8a77992f05e9012a"`);
        await queryRunner.query(`DROP TABLE "esign"."signature_stamp_teammates_user_master"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_d7b0843143d8b749373a558d09"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_f12feaa6c0e1eddb9bf27973da"`);
        await queryRunner.query(`DROP TABLE "esign"."signature_teammates_user_master"`);
    }

}
