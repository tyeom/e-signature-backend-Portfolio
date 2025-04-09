import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742797259161 implements MigrationInterface {
    name = 'Init1742797259161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."notification_setting" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "version" integer NOT NULL, "signingStarted" boolean NOT NULL DEFAULT false, "signingComplete" boolean NOT NULL DEFAULT false, "declineSignatures" boolean NOT NULL DEFAULT false, "canceledSignatures" boolean NOT NULL DEFAULT false, "canceledSignatureReq" boolean NOT NULL DEFAULT false, "turnForSignature" boolean NOT NULL DEFAULT false, "disableNotiForSignatureReq" boolean NOT NULL DEFAULT false, "CreatedBy" integer, "ModifiedBy" integer, CONSTRAINT "PK_2321675ab362520fa805a0de40c" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "esign"."notification_setting" ADD CONSTRAINT "FK_b304d68a391d109da0300dc2982" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."notification_setting" ADD CONSTRAINT "FK_8db7b77d6a281bad215ff0bd297" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."notification_setting" DROP CONSTRAINT "FK_8db7b77d6a281bad215ff0bd297"`);
        await queryRunner.query(`ALTER TABLE "esign"."notification_setting" DROP CONSTRAINT "FK_b304d68a391d109da0300dc2982"`);
        await queryRunner.query(`DROP TABLE "esign"."notification_setting"`);
    }

}
