import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source';
import { UsuarioModule } from './usuario/usuario.module';
import { RolModule } from './rol/rol.module';
import { ClienteModule } from './cliente/cliente.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ProductoModule } from './producto/producto.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { HistorialStockModule } from './historial-stock/historial-stock.module';
import { VentaModule } from './venta/venta.module';
import { PagoModule } from './pago/pago.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
    }),
    UsuarioModule,
    RolModule,
    CategoriaModule,
    ClienteModule,
    DetalleVentaModule,
    HistorialStockModule,
    PagoModule,
    ProductoModule,
    VentaModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
