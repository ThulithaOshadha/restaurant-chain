import { MigrationInterface, QueryRunner } from "typeorm";

export class Branchcity1724476353279 implements MigrationInterface {
    name = 'Branchcity1724476353279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reservations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total" double precision NOT NULL, "description" text, "personCount" integer, "reservationDate" TIMESTAMP, "status" integer NOT NULL DEFAULT '2', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, "userId" uuid, "branchId" uuid, CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reservation_products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitPrice" double precision NOT NULL, "qty" integer NOT NULL, "totalPrice" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, "reservationId" uuid, "productId" uuid, CONSTRAINT "PK_e2d30429dc51516d9a697d25227" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branches_files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "altTag" character varying, "isDefault" boolean NOT NULL DEFAULT false, "fileId" uuid, "branchId" uuid, CONSTRAINT "PK_c0fa7f35c2570dd96cf8dbd6aa8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lat" numeric, "lang" numeric, "mapObject" json, "status" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "branches" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "status" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "cityId" uuid, CONSTRAINT "REL_3d3edc7bbc6f133907163ff9cd" UNIQUE ("cityId"), CONSTRAINT "PK_7f37d3b42defea97f1df0d19535" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_ba100a3340d40e8e9bb4936d3c2" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_products" ADD CONSTRAINT "FK_1469d2b69aeae5bef7d60659e2e" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_products" ADD CONSTRAINT "FK_c7d34dbac9e25811d9c0c77199a" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches_files" ADD CONSTRAINT "FK_25ad00af928149cd5a860bd3dc3" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches_files" ADD CONSTRAINT "FK_633e566d27b954179e7ff3a1490" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branches" ADD CONSTRAINT "FK_3d3edc7bbc6f133907163ff9cdc" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branches" DROP CONSTRAINT "FK_3d3edc7bbc6f133907163ff9cdc"`);
        await queryRunner.query(`ALTER TABLE "branches_files" DROP CONSTRAINT "FK_633e566d27b954179e7ff3a1490"`);
        await queryRunner.query(`ALTER TABLE "branches_files" DROP CONSTRAINT "FK_25ad00af928149cd5a860bd3dc3"`);
        await queryRunner.query(`ALTER TABLE "reservation_products" DROP CONSTRAINT "FK_c7d34dbac9e25811d9c0c77199a"`);
        await queryRunner.query(`ALTER TABLE "reservation_products" DROP CONSTRAINT "FK_1469d2b69aeae5bef7d60659e2e"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_ba100a3340d40e8e9bb4936d3c2"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1cc2c4f54da32bf8282154c"`);
        await queryRunner.query(`DROP TABLE "branches"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "branches_files"`);
        await queryRunner.query(`DROP TABLE "reservation_products"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
    }

}
