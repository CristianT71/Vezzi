import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1782957692643 implements MigrationInterface {
    name = 'Init1782957692643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rol" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre" character varying(20) NOT NULL, "descripcion" text, "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_9792c580a992d554ee1621c5b45" UNIQUE ("nombre"), CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nombre_usuario" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "nombre_completo" character varying(155) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "deleteAt" TIMESTAMP, "id_rol" uuid NOT NULL, CONSTRAINT "UQ_478a50149cbb7366c7d2aab8ea3" UNIQUE ("nombre_usuario"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pago" ("id" SERIAL NOT NULL, "monto" numeric(12,2) NOT NULL, "metodo_pago" character varying(30) NOT NULL, "referencia" character varying(80), "fecha_pago" TIMESTAMP NOT NULL DEFAULT now(), "estado" character varying(20) NOT NULL DEFAULT 'REGISTRADO', "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id_venta" integer NOT NULL, "id_cliente" integer NOT NULL, "id_usuario" uuid NOT NULL, CONSTRAINT "PK_6be14be998d5e41f10e58c0e651" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cliente" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "telefono" character varying(20) NOT NULL, "saldo_deuda" numeric(12,2) NOT NULL DEFAULT '0', "fecha_registro" TIMESTAMP NOT NULL DEFAULT now(), "activo" boolean NOT NULL DEFAULT true, "deleteAt" TIMESTAMP, CONSTRAINT "PK_18990e8df6cf7fe71b9dc0f5f39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("id" SERIAL NOT NULL, "nombre" character varying(100) NOT NULL, "descripcion" text, "activo" boolean NOT NULL DEFAULT true, "deleteAt" TIMESTAMP, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6771d90221138c5bf48044fd73d" UNIQUE ("nombre"), CONSTRAINT "PK_f027836b77b84fb4c3a374dc70d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "historial_stock" ("id" SERIAL NOT NULL, "tipo_movimiento" character varying(30) NOT NULL, "cantidad" integer NOT NULL, "stock_anterior" integer NOT NULL, "stock_nuevo" integer NOT NULL, "observacion" character varying(255), "fecha_movimiento" TIMESTAMP NOT NULL DEFAULT now(), "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id_producto" integer NOT NULL, CONSTRAINT "PK_69ae61eb829990b30cc90e7a66f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "producto" ("id" SERIAL NOT NULL, "codigo" character varying(50) NOT NULL, "nombre" character varying(150) NOT NULL, "costo" numeric(12,2) NOT NULL, "precio_venta" numeric(12,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "stock_minimo" integer NOT NULL DEFAULT '0', "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id_categoria" integer NOT NULL, CONSTRAINT "PK_5be023b11909fe103e24c740c7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "detalle_venta" ("id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric(12,2) NOT NULL, "subtotal" numeric(12,2) NOT NULL, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id_venta" integer NOT NULL, "id_producto" integer NOT NULL, CONSTRAINT "PK_15e83370f604ee4b71e7299514e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "venta" ("id" SERIAL NOT NULL, "numero_venta" character varying(30) NOT NULL, "fecha_venta" TIMESTAMP NOT NULL DEFAULT now(), "impuesto" numeric(12,2) NOT NULL DEFAULT '0', "total" numeric(12,2) NOT NULL DEFAULT '0', "estado" character varying(20) NOT NULL DEFAULT 'EMITIDA', "activo" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, "id_cliente" integer NOT NULL, "id_usuario" uuid NOT NULL, CONSTRAINT "UQ_9cc9c37e16aa9b9bb7162074277" UNIQUE ("numero_venta"), CONSTRAINT "PK_8bb53d01fe72521d5cfb1f149d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_3628e9894c4b014d61a01cb21dd" FOREIGN KEY ("id_rol") REFERENCES "rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_08566b30a4951f806a4d89d35cc" FOREIGN KEY ("id_venta") REFERENCES "venta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_ab001a71ce56c2f20df35811204" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pago" ADD CONSTRAINT "FK_39f3d30a022ca806672a44b5d06" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "historial_stock" ADD CONSTRAINT "FK_2fae34807f46c6d8636f4bb223d" FOREIGN KEY ("id_producto") REFERENCES "producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producto" ADD CONSTRAINT "FK_e87a319f3da1b6da5fedd1988be" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "FK_175fd103d258655939b7fa81530" FOREIGN KEY ("id_venta") REFERENCES "venta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" ADD CONSTRAINT "FK_46042990544850e9e972c1961e8" FOREIGN KEY ("id_producto") REFERENCES "producto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venta" ADD CONSTRAINT "FK_777d3faa95ab9ee43830dc14b8b" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venta" ADD CONSTRAINT "FK_20f57a0cfaec67d68d88ff8420d" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venta" DROP CONSTRAINT "FK_20f57a0cfaec67d68d88ff8420d"`);
        await queryRunner.query(`ALTER TABLE "venta" DROP CONSTRAINT "FK_777d3faa95ab9ee43830dc14b8b"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "FK_46042990544850e9e972c1961e8"`);
        await queryRunner.query(`ALTER TABLE "detalle_venta" DROP CONSTRAINT "FK_175fd103d258655939b7fa81530"`);
        await queryRunner.query(`ALTER TABLE "producto" DROP CONSTRAINT "FK_e87a319f3da1b6da5fedd1988be"`);
        await queryRunner.query(`ALTER TABLE "historial_stock" DROP CONSTRAINT "FK_2fae34807f46c6d8636f4bb223d"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_39f3d30a022ca806672a44b5d06"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_ab001a71ce56c2f20df35811204"`);
        await queryRunner.query(`ALTER TABLE "pago" DROP CONSTRAINT "FK_08566b30a4951f806a4d89d35cc"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_3628e9894c4b014d61a01cb21dd"`);
        await queryRunner.query(`DROP TABLE "venta"`);
        await queryRunner.query(`DROP TABLE "detalle_venta"`);
        await queryRunner.query(`DROP TABLE "producto"`);
        await queryRunner.query(`DROP TABLE "historial_stock"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "cliente"`);
        await queryRunner.query(`DROP TABLE "pago"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "rol"`);
    }

}
