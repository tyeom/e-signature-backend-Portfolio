import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742341254395 implements MigrationInterface {
    name = 'Init1742341254395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."request_e_sign" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CreatedBy" integer NOT NULL, "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedBy" integer NOT NULL, "projectName" character varying NOT NULL, "documentName" character varying NOT NULL, "createdDate" TIMESTAMP NOT NULL DEFAULT now(), "expireDate" TIMESTAMP, "requestSignatureForMe" boolean NOT NULL DEFAULT false, "scheduledSend" boolean NOT NULL DEFAULT false, "scheduledSendDate" TIMESTAMP, "allowDocumentEditing" boolean NOT NULL DEFAULT false, "mustSignInOrder" boolean NOT NULL DEFAULT false, "internalSignature" boolean NOT NULL DEFAULT false, "creatorId" integer, CONSTRAINT "PK_869f56ef052405e02e5d31ad1d9" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."requestee" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CreatedBy" integer NOT NULL, "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedBy" integer NOT NULL, "order" integer NOT NULL, "name" character varying NOT NULL, "email" character varying, "sms" character varying, "notificationMethod" character varying NOT NULL DEFAULT 'email', "notificationLanguage" character varying NOT NULL DEFAULT 'en', "securityCode" character varying, "useSecurityCode" boolean NOT NULL DEFAULT false, "phone" character varying, "useCellphoneAuth" boolean NOT NULL DEFAULT false, "countrySpecificCert" boolean NOT NULL DEFAULT false, "kakaoAuth" boolean NOT NULL DEFAULT false, "publicAuth" boolean NOT NULL DEFAULT false, "message" character varying, "useMessage" boolean NOT NULL DEFAULT false, "useAttachFile" boolean NOT NULL DEFAULT false, "attachedFiles" text array, "applySameOptions" boolean NOT NULL DEFAULT false, "requestESignId" integer, CONSTRAINT "PK_644122242058d0f0cde7fbcb32a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."request_e_sign_teammates_user_master" ("requestESignId" integer NOT NULL, "userMasterId" integer NOT NULL, CONSTRAINT "PK_69e59c425c0ad6b83728645526a" PRIMARY KEY ("requestESignId", "userMasterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55390d05487c4903d473946cfd" ON "esign"."request_e_sign_teammates_user_master" ("requestESignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9eee13227f31fe71dac6f05d7d" ON "esign"."request_e_sign_teammates_user_master" ("userMasterId") `);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD CONSTRAINT "FK_13d192bb68ecc359d4b1641c02b" FOREIGN KEY ("creatorId") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" ADD CONSTRAINT "FK_15df1ac60800e37a19773c63bc2" FOREIGN KEY ("requestESignId") REFERENCES "esign"."request_e_sign"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" ADD CONSTRAINT "FK_55390d05487c4903d473946cfd5" FOREIGN KEY ("requestESignId") REFERENCES "esign"."request_e_sign"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" ADD CONSTRAINT "FK_9eee13227f31fe71dac6f05d7d4" FOREIGN KEY ("userMasterId") REFERENCES "web"."UserMaster"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" DROP CONSTRAINT "FK_9eee13227f31fe71dac6f05d7d4"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" DROP CONSTRAINT "FK_55390d05487c4903d473946cfd5"`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" DROP CONSTRAINT "FK_15df1ac60800e37a19773c63bc2"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP CONSTRAINT "FK_13d192bb68ecc359d4b1641c02b"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_9eee13227f31fe71dac6f05d7d"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_55390d05487c4903d473946cfd"`);
        await queryRunner.query(`DROP TABLE "esign"."request_e_sign_teammates_user_master"`);
        await queryRunner.query(`DROP TABLE "esign"."requestee"`);
        await queryRunner.query(`DROP TABLE "esign"."request_e_sign"`);
    }

}
