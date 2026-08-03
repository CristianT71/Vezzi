import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { VentaPublicoController } from './venta-publico.controller';
import { FacturaEmailService } from './factura-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { DetalleVenta } from 'src/detalle-venta/entities/detalle-venta.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { HistorialStock } from 'src/historial-stock/entities/historial-stock.entity';

@Module({
  controllers: [VentaController, VentaPublicoController],
  providers: [VentaService, FacturaEmailService],
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Usuario, DetalleVenta, Producto, HistorialStock])],
})
export class VentaModule {}
