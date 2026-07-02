import { Module } from '@nestjs/common';
import { HistorialStockService } from './historial-stock.service';
import { HistorialStockController } from './historial-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialStock } from './entities/historial-stock.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Module({
  controllers: [HistorialStockController],
  providers: [HistorialStockService],
  imports: [TypeOrmModule.forFeature([HistorialStock, Producto])],
})
export class HistorialStockModule {}
