import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744071441835 implements MigrationInterface {
    name = 'Init1744071441835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."mail_templates_detail" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "order" integer NOT NULL, "documentName" character varying NOT NULL, "signatoryName" character varying NOT NULL, "emailOrPhone" character varying NOT NULL, "userLang" character varying NOT NULL, "comment" character varying, "password" character varying, "passwordHint" character varying, "CreatedBy" integer, "ModifiedBy" integer, "mailTemplatesId" integer, CONSTRAINT "PK_3df4d3e3f91738471243d1cabf3" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."mail_templates" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "Label" character varying NOT NULL, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_7fffe1d94b71d760cc6fe490da6" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" ADD CONSTRAINT "FK_44d2b94d51449f2e938cf78d3c8" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" ADD CONSTRAINT "FK_fb3e46d5d349dec2877e41c5734" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" ADD CONSTRAINT "FK_cd2fbe797908cd0533631f0c62e" FOREIGN KEY ("mailTemplatesId") REFERENCES "esign"."mail_templates"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates" ADD CONSTRAINT "FK_70c1c085164eb68c6aa2ee25c7a" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates" ADD CONSTRAINT "FK_f956ed5b1c2c896111cbd4943ee" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates" DROP CONSTRAINT "FK_f956ed5b1c2c896111cbd4943ee"`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates" DROP CONSTRAINT "FK_70c1c085164eb68c6aa2ee25c7a"`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" DROP CONSTRAINT "FK_cd2fbe797908cd0533631f0c62e"`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" DROP CONSTRAINT "FK_fb3e46d5d349dec2877e41c5734"`);
        await queryRunner.query(`ALTER TABLE "esign"."mail_templates_detail" DROP CONSTRAINT "FK_44d2b94d51449f2e938cf78d3c8"`);
        await queryRunner.query(`DROP TABLE "esign"."mail_templates"`);
        await queryRunner.query(`DROP TABLE "esign"."mail_templates_detail"`);
    }

}
