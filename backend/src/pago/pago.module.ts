import { Module } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  controllers: [PagoController],
  providers: [PagoService],
  imports: [TypeOrmModule.forFeature([Pago, Venta, Cliente, Usuario])],
})
export class PagoModule {}
