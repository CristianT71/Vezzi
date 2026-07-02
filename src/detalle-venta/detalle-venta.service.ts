import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { HistorialStock } from 'src/historial-stock/entities/historial-stock.entity';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,

    @InjectRepository(HistorialStock)
    private readonly historialRepo: Repository<HistorialStock>,
  ) {}

  async create(createDto: CreateDetalleVentaDto) {
    try {
      const venta = await this.ventaRepo.findOneBy({ id: createDto.id_venta });
      if (!venta) {
        throw new NotFoundException(`Venta con id ${createDto.id_venta} no existe`);
      }
      const producto = await this.productoRepo.findOneBy({ id: createDto.id_producto });
      if (!producto) {
        throw new NotFoundException(`Producto con id ${createDto.id_producto} no existe`);
      }

      if (producto.stock < createDto.cantidad) {
        throw new BadRequestException(`Stock insuficiente para "${producto.nombre}" Stock actual: ${producto.stock}`);
      }

      const subtotal = (createDto.cantidad * Number(createDto.precio_unitario)).toFixed(2);
      const detalle = this.detalleRepo.create({
        venta,
        producto,
        cantidad: createDto.cantidad,
        precio_unitario: createDto.precio_unitario,
        subtotal,
      } as any);

      const stockAnterior = producto.stock;
      producto.stock = stockAnterior - createDto.cantidad;
      await this.productoRepo.save(producto);

      await this.historialRepo.save({
        producto,
        tipo_movimiento: 'salida',
        cantidad: createDto.cantidad,
        stock_anterior: stockAnterior,
        stock_nuevo: producto.stock,
        observacion: `Venta #${venta.id}`,
      } as any);

      return await this.detalleRepo.save(detalle);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo crear el detalle de venta');
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [ data, total ] = await this.detalleRepo.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const det = await this.detalleRepo.findOneBy({ id, deletedAt: IsNull() });
    if (!det) throw new NotFoundException(`DetalleVenta con id ${id} no existe`);
    return det;
  }

  async update(id: number, updateDto: UpdateDetalleVentaDto) {
    let venta;
    let producto;
    if (updateDto.id_venta) {
      venta = await this.ventaRepo.findOneBy({ id: updateDto.id_venta });
      if (!venta) {
        throw new NotFoundException(`Venta con id ${updateDto.id_venta} no existe`);
      }
    }
    if (updateDto.id_producto) {
      producto = await this.productoRepo.findOneBy({ id: updateDto.id_producto });
      if (!producto) throw new NotFoundException(`Producto con id ${updateDto.id_producto} no existe`);
    }
    const { id_producto, id_venta, ...rest } = updateDto;
    const subtotal = rest.cantidad && rest.precio_unitario ? (rest.cantidad * Number(rest.precio_unitario)).toFixed(2) : undefined;
    const detalle = await this.detalleRepo.preload({ id, ...rest, ...(venta && { venta }), ...(producto && { producto }), ...(subtotal && { subtotal }) } as any);
    if (!detalle) throw new NotFoundException(`DetalleVenta con id ${id} no existe`);
    try {
      await this.detalleRepo.save(detalle);
      return detalle;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar el detalle de venta');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.detalleRepo.softDelete(id);
    return 'DetalleVenta eliminado exitosamente';
  }

  async restaurar(id: number) {
    const det = await this.detalleRepo.findOneBy({ id });
    if (!det) {
      throw new NotFoundException(`DetalleVenta con id ${id} no existe`);
    }
    await this.detalleRepo.restore(id);
    return 'DetalleVenta restaurado exitosamente';
  }
}
