import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  controllers: [VentaController],
  providers: [VentaService],
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Usuario])],
})
export class VentaModule {}
