import { MigrationInterface, QueryRunner } from "typeorm";

export class PagoVentaOpcional1785722642884 implements MigrationInterface {
    name = 'PagoVentaOpcional1785722642884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "id_venta" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pago" ALTER COLUMN "id_venta" SET NOT NULL`);
    }
}
