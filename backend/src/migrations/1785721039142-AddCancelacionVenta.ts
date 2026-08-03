import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCancelacionVenta1785721039142 implements MigrationInterface {
    name = 'AddCancelacionVenta1785721039142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venta" ADD "motivo_cancelacion" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "venta" ADD "fecha_cancelacion" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venta" DROP COLUMN "fecha_cancelacion"`);
        await queryRunner.query(`ALTER TABLE "venta" DROP COLUMN "motivo_cancelacion"`);
    }
}
