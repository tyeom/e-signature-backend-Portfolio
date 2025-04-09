import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1743390964088 implements MigrationInterface {
    name = 'Init1743390964088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."sign_log" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "signedPdfFileName" character varying NOT NULL, "signedDataDigest" character varying NOT NULL, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_e8a3e8ec172b5e7af89bb48ae35" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_log" ADD CONSTRAINT "FK_e40a6eac70c16f47ae16e99dd2e" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_log" ADD CONSTRAINT "FK_4a5aa6f29c0efcffb0c5e02c557" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."sign_log" DROP CONSTRAINT "FK_4a5aa6f29c0efcffb0c5e02c557"`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_log" DROP CONSTRAINT "FK_e40a6eac70c16f47ae16e99dd2e"`);
        await queryRunner.query(`DROP TABLE "esign"."sign_log"`);
    }

}
