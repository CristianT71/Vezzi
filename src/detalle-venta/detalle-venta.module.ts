import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  imports: [TypeOrmModule.forFeature([DetalleVenta, Producto])],
})
export class DetalleVentaModule {}
