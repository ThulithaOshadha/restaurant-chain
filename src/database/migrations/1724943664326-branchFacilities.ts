import { MigrationInterface, QueryRunner } from "typeorm";

export class BranchFacilities1724943664326 implements MigrationInterface {
    name = 'BranchFacilities1724943664326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branch_faciliies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "facilityId" uuid, "branchId" uuid, CONSTRAINT "PK_5e9f06342aa98cadb9f6b60f6a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "branch_faciliies" ADD CONSTRAINT "FK_52ba6dc4e7639fc5de10f256ae2" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "branch_faciliies" ADD CONSTRAINT "FK_57e48c33e9558966b3b34b00958" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch_faciliies" DROP CONSTRAINT "FK_57e48c33e9558966b3b34b00958"`);
        await queryRunner.query(`ALTER TABLE "branch_faciliies" DROP CONSTRAINT "FK_52ba6dc4e7639fc5de10f256ae2"`);
        await queryRunner.query(`DROP TABLE "branch_faciliies"`);
    }

}
