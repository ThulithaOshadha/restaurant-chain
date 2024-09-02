import { MigrationInterface, QueryRunner } from "typeorm";

export class TablesEntity1725296857317 implements MigrationInterface {
    name = 'TablesEntity1725296857317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tables" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "personCount" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', "paymentMethod" character varying NOT NULL DEFAULT 'Cash On Delivery', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteDate" TIMESTAMP, "orderId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "qty" integer, "unitPrice" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "orderId" uuid, "productId" uuid, CONSTRAINT "PK_539ede39e518562dfdadfddb492" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" ADD "tableId" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "orderStatus" character varying NOT NULL DEFAULT 'Pending'`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "orderDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "shippingAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" ADD CONSTRAINT "FK_5fd5297e1999f283ebb06d340e1" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_3fb066240db56c9558a91139431" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_product" ADD CONSTRAINT "FK_073c85ed133e05241040bd70f02" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_073c85ed133e05241040bd70f02"`);
        await queryRunner.query(`ALTER TABLE "order_product" DROP CONSTRAINT "FK_3fb066240db56c9558a91139431"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" DROP CONSTRAINT "FK_5fd5297e1999f283ebb06d340e1"`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "shippingAddress"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderDate"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "orderStatus"`);
        await queryRunner.query(`ALTER TABLE "reservation_tables" DROP COLUMN "tableId"`);
        await queryRunner.query(`DROP TABLE "order_product"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "tables"`);
    }

}
