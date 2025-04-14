import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744591928687 implements MigrationInterface {
    name = 'Init1744591928687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."signature_stamp" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "stampName" character varying NOT NULL, "stampType" character varying NOT NULL, "stampImgs" text array, "stampHeight" character varying, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_6f8be3504f518951a524ab97ec4" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."user_default_signature" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "type" character varying NOT NULL, "CreatedBy" integer, "ModifiedBy" integer, "signatureId" integer, "stampId" integer, CONSTRAINT "REL_8e5b7debc262a5c9620c640fa4" UNIQUE ("signatureId"), CONSTRAINT "REL_b11c7dede257f4534f2d93f20d" UNIQUE ("stampId"), CONSTRAINT "PK_841d7b6a01a1bad0c9f37b06ca3" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" DROP COLUMN "signatureImg"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" ADD "signatureImgs" text array`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" ADD "initialsImgs" text array`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp" ADD CONSTRAINT "FK_137961b9419c956e873e95efa47" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp" ADD CONSTRAINT "FK_ede73086437a514e1dba428facb" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_b224558567b12ee9f3b738cdc0e" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_f16dcca4a40a836d1a04e36eaaf" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_8e5b7debc262a5c9620c640fa41" FOREIGN KEY ("signatureId") REFERENCES "esign"."signature"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_b11c7dede257f4534f2d93f20df" FOREIGN KEY ("stampId") REFERENCES "esign"."signature_stamp"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_b11c7dede257f4534f2d93f20df"`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_8e5b7debc262a5c9620c640fa41"`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_f16dcca4a40a836d1a04e36eaaf"`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_b224558567b12ee9f3b738cdc0e"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp" DROP CONSTRAINT "FK_ede73086437a514e1dba428facb"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature_stamp" DROP CONSTRAINT "FK_137961b9419c956e873e95efa47"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" DROP COLUMN "initialsImgs"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" DROP COLUMN "signatureImgs"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" ADD "signatureImg" character varying`);
        await queryRunner.query(`DROP TABLE "esign"."user_default_signature"`);
        await queryRunner.query(`DROP TABLE "esign"."signature_stamp"`);
    }

}
