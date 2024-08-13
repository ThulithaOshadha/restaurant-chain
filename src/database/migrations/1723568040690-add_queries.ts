import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQueries1723568040690 implements MigrationInterface {
    name = 'AddQueries1723568040690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "query" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "queryText" text NOT NULL, "response" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteddAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_be23114e9d505264e2fdd227537" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "query" ADD CONSTRAINT "FK_3bd886648cf9870af0be5997c98" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "query" DROP CONSTRAINT "FK_3bd886648cf9870af0be5997c98"`);
        await queryRunner.query(`DROP TABLE "query"`);
    }

}
