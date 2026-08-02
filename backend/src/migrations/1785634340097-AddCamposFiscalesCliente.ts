import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCamposFiscalesCliente1785634340097 implements MigrationInterface {
    name = 'AddCamposFiscalesCliente1785634340097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cliente" ADD "nit" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "cliente" ADD "direccion" character varying(200)`);
        await queryRunner.query(`ALTER TABLE "cliente" ADD "email" character varying(150)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cliente" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "cliente" DROP COLUMN "direccion"`);
        await queryRunner.query(`ALTER TABLE "cliente" DROP COLUMN "nit"`);
    }
}
