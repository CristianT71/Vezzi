import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialStock } from './entities/historial-stock.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { CreateHistorialStockDto } from './dto/create-historial-stock.dto';
import { UpdateHistorialStockDto } from './dto/update-historial-stock.dto';

@Injectable()
export class HistorialStockService {
  constructor(
    @InjectRepository(HistorialStock)
    private readonly historialRepository: Repository<HistorialStock>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createHistorialStockDto: CreateHistorialStockDto) {
    try {
      const producto = await this.productoRepository.findOneBy({ id: createHistorialStockDto.id_producto });
      if (!producto) {
        throw new NotFoundException(`Producto con id ${createHistorialStockDto.id_producto} no existe`);
      }

      const historial = this.historialRepository.create({
        producto,
        tipo_movimiento: createHistorialStockDto.tipo_movimiento,
        cantidad: createHistorialStockDto.cantidad,
        stock_anterior: createHistorialStockDto.stock_anterior,
        stock_nuevo: createHistorialStockDto.stock_nuevo,
        observacion: createHistorialStockDto.observacion,
      });

      producto.stock = createHistorialStockDto.stock_nuevo;
      await this.productoRepository.save(producto);

      return await this.historialRepository.save(historial);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo crear el historial de stock');
    }
  }

  findAll() {
    return this.historialRepository.find();
  }

  async findOne(id: number) {
    const historial = await this.historialRepository.findOneBy({ id });
    if (!historial) {
      throw new NotFoundException(`HistorialStock con id ${id} no existe`);
    }
    return historial;
  }

  async update(id: number, updateHistorialStockDto: UpdateHistorialStockDto) {
    let producto;
    if ((updateHistorialStockDto as any).id_producto) {
      producto = await this.productoRepository.findOneBy({ id: (updateHistorialStockDto as any).id_producto });
      if (!producto) {
        throw new NotFoundException(`Producto con id ${(updateHistorialStockDto as any).id_producto} no existe`);
      }
    }

    const { id_producto, ...historialData } = updateHistorialStockDto as any;
    const historial = await this.historialRepository.preload({
      id,
      ...(historialData as any),
      ...(producto && { producto }),
    });

    if (!historial) {
      throw new NotFoundException(`HistorialStock con id ${id} no existe`);
    }

    try {
      if ((historialData as any).stock_nuevo && producto) {
        producto.stock = (historialData as any).stock_nuevo;
        await this.productoRepository.save(producto);
      }
      await this.historialRepository.save(historial);
      return historial;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar el historial de stock');
    }
  }

  async remove(id: number) {
    const historial = await this.findOne(id);
    await this.historialRepository.remove(historial);
    return 'HistorialStock eliminado exitosamente';
  }
}
