import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1743477383382 implements MigrationInterface {
    name = 'Init1743477383382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."signature" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "fullName" character varying NOT NULL, "initials" character varying NOT NULL, "signatureImg" character varying, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_19949fbddc599cdc9a29003b856" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."user_default_signature" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "CreatedBy" integer, "ModifiedBy" integer, "signatureId" integer, CONSTRAINT "REL_8e5b7debc262a5c9620c640fa4" UNIQUE ("signatureId"), CONSTRAINT "PK_841d7b6a01a1bad0c9f37b06ca3" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" ADD CONSTRAINT "FK_3594a2aaa886b0d693044d2a99f" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" ADD CONSTRAINT "FK_5d6e287eda1b5821e581519f618" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_b224558567b12ee9f3b738cdc0e" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_f16dcca4a40a836d1a04e36eaaf" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" ADD CONSTRAINT "FK_8e5b7debc262a5c9620c640fa41" FOREIGN KEY ("signatureId") REFERENCES "esign"."signature"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_8e5b7debc262a5c9620c640fa41"`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_f16dcca4a40a836d1a04e36eaaf"`);
        await queryRunner.query(`ALTER TABLE "esign"."user_default_signature" DROP CONSTRAINT "FK_b224558567b12ee9f3b738cdc0e"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" DROP CONSTRAINT "FK_5d6e287eda1b5821e581519f618"`);
        await queryRunner.query(`ALTER TABLE "esign"."signature" DROP CONSTRAINT "FK_3594a2aaa886b0d693044d2a99f"`);
        await queryRunner.query(`DROP TABLE "esign"."user_default_signature"`);
        await queryRunner.query(`DROP TABLE "esign"."signature"`);
    }

}
