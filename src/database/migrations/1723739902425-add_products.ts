import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProducts1723739902425 implements MigrationInterface {
    name = 'AddProducts1723739902425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" double precision, "description" text, "status" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "altTag" character varying, "isDefault" boolean NOT NULL DEFAULT false, "fileId" uuid, "productId" uuid, CONSTRAINT "PK_08ced89734a099b1cd8d648d383" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isDefault" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, "galleryId" uuid, "fileId" uuid, CONSTRAINT "PK_ec0b191e7b5d64e830b9df8d412" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, CONSTRAINT "PK_65d7a1ef91ddafb3e7071b188a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products_files" ADD CONSTRAINT "FK_160d24f1d84064b624016d0d203" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_files" ADD CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery_files" ADD CONSTRAINT "FK_6febc7f71332321e8758300c287" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery_files" ADD CONSTRAINT "FK_c5b659151a7cd44d2aa3795b336" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery_files" DROP CONSTRAINT "FK_c5b659151a7cd44d2aa3795b336"`);
        await queryRunner.query(`ALTER TABLE "gallery_files" DROP CONSTRAINT "FK_6febc7f71332321e8758300c287"`);
        await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_d6143daa56b0a61c160ea9b15c5"`);
        await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_160d24f1d84064b624016d0d203"`);
        await queryRunner.query(`DROP TABLE "gallery"`);
        await queryRunner.query(`DROP TABLE "gallery_files"`);
        await queryRunner.query(`DROP TABLE "products_files"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
