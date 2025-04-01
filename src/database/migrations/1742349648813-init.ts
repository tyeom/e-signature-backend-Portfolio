import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742349648813 implements MigrationInterface {
    name = 'Init1742349648813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "esign"."request_e_sign" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projectName" character varying NOT NULL, "documentName" character varying NOT NULL, "requestESignCreatedDate" TIMESTAMP NOT NULL DEFAULT now(), "requestESignExpireDate" TIMESTAMP, "requestSignatureForMe" boolean NOT NULL DEFAULT false, "scheduledSend" boolean NOT NULL DEFAULT false, "scheduledSendDate" TIMESTAMP, "allowDocumentEditing" boolean NOT NULL DEFAULT false, "mustSignInOrder" boolean NOT NULL DEFAULT false, "internalSignature" boolean NOT NULL DEFAULT false, "CreatedBy" integer, "ModifiedBy" integer, "requestESignCreatorId" integer, CONSTRAINT "PK_869f56ef052405e02e5d31ad1d9" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."requestee" ("Id" SERIAL NOT NULL, "SaveStatus" character varying NOT NULL, "ApprovalStatus" character varying NOT NULL, "IsActive" boolean NOT NULL, "IsDeleted" boolean, "EntryOrigin" character varying NOT NULL, "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ModifiedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "order" integer NOT NULL, "name" character varying NOT NULL, "email" character varying, "sms" character varying, "notificationMethod" character varying NOT NULL DEFAULT 'email', "notificationLanguage" character varying NOT NULL DEFAULT 'en', "securityCode" character varying, "useSecurityCode" boolean NOT NULL DEFAULT false, "phone" character varying, "useCellphoneAuth" boolean NOT NULL DEFAULT false, "countrySpecificCert" boolean NOT NULL DEFAULT false, "kakaoAuth" boolean NOT NULL DEFAULT false, "publicAuth" boolean NOT NULL DEFAULT false, "message" character varying, "useMessage" boolean NOT NULL DEFAULT false, "useAttachFile" boolean NOT NULL DEFAULT false, "attachedFiles" text array, "applySameOptions" boolean NOT NULL DEFAULT false, "CreatedBy" integer, "ModifiedBy" integer, "requestESignId" integer, CONSTRAINT "PK_644122242058d0f0cde7fbcb32a" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "esign"."request_e_sign_teammates_user_master" ("requestESignId" integer NOT NULL, "userMasterId" integer NOT NULL, CONSTRAINT "PK_69e59c425c0ad6b83728645526a" PRIMARY KEY ("requestESignId", "userMasterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55390d05487c4903d473946cfd" ON "esign"."request_e_sign_teammates_user_master" ("requestESignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9eee13227f31fe71dac6f05d7d" ON "esign"."request_e_sign_teammates_user_master" ("userMasterId") `);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD CONSTRAINT "FK_765608e703685d258bedad26abe" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD CONSTRAINT "FK_da6368df91a36f5493e6d3b31af" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" ADD CONSTRAINT "FK_4dd6fdc1fd4596fadb7d795c203" FOREIGN KEY ("requestESignCreatorId") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" ADD CONSTRAINT "FK_0cfd41c13a6a29b820de8737e9c" FOREIGN KEY ("CreatedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" ADD CONSTRAINT "FK_24ec563b62f5821c966899c5108" FOREIGN KEY ("ModifiedBy") REFERENCES "web"."UserMaster"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" ADD CONSTRAINT "FK_15df1ac60800e37a19773c63bc2" FOREIGN KEY ("requestESignId") REFERENCES "esign"."request_e_sign"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" ADD CONSTRAINT "FK_55390d05487c4903d473946cfd5" FOREIGN KEY ("requestESignId") REFERENCES "esign"."request_e_sign"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" ADD CONSTRAINT "FK_9eee13227f31fe71dac6f05d7d4" FOREIGN KEY ("userMasterId") REFERENCES "web"."UserMaster"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" DROP CONSTRAINT "FK_9eee13227f31fe71dac6f05d7d4"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign_teammates_user_master" DROP CONSTRAINT "FK_55390d05487c4903d473946cfd5"`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" DROP CONSTRAINT "FK_15df1ac60800e37a19773c63bc2"`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" DROP CONSTRAINT "FK_24ec563b62f5821c966899c5108"`);
        await queryRunner.query(`ALTER TABLE "esign"."requestee" DROP CONSTRAINT "FK_0cfd41c13a6a29b820de8737e9c"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP CONSTRAINT "FK_4dd6fdc1fd4596fadb7d795c203"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP CONSTRAINT "FK_da6368df91a36f5493e6d3b31af"`);
        await queryRunner.query(`ALTER TABLE "esign"."request_e_sign" DROP CONSTRAINT "FK_765608e703685d258bedad26abe"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_9eee13227f31fe71dac6f05d7d"`);
        await queryRunner.query(`DROP INDEX "esign"."IDX_55390d05487c4903d473946cfd"`);
        await queryRunner.query(`DROP TABLE "esign"."request_e_sign_teammates_user_master"`);
        await queryRunner.query(`DROP TABLE "esign"."requestee"`);
        await queryRunner.query(`DROP TABLE "esign"."request_e_sign"`);
    }

}
