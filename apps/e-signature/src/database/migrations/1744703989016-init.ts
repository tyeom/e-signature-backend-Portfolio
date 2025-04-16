import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744703989016 implements MigrationInterface {
    name = 'Init1744703989016'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."sign_document" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "editingStatus" character varying NOT NULL DEFAULT 'editing', "documentStatus" character varying NOT NULL DEFAULT 'unknow', "pdfUserPassword" character varying, "pdfOwnerPassword" character varying, "attachedFiles" text array, "editedFile" character varying, "signedDataDigest" character varying, "documentBlob" text, "documentInfo1" text, "documentInfo2" text, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_dec3156d4a1dbb52257815b36f8" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD "attachedFileType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" ADD CONSTRAINT "FK_4497f075b6095750c4da925c90d" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" ADD CONSTRAINT "FK_d5ac4936d717753fbe9c2d8fcff" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" DROP CONSTRAINT "FK_d5ac4936d717753fbe9c2d8fcff"`);
        await queryRunner.query(`ALTER TABLE "esign"."sign_document" DROP CONSTRAINT "FK_4497f075b6095750c4da925c90d"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP COLUMN "attachedFileType"`);
        await queryRunner.query(`DROP TABLE "esign"."sign_document"`);
    }

}
