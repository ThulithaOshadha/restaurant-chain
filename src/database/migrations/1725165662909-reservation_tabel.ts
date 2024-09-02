import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationTabel1725165662909 implements MigrationInterface {
    name = 'ReservationTabel1725165662909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_tables" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_tables" DROP COLUMN "description"`);
    }

}
