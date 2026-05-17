import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from 'src/producto/entities/producto.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';

@Injectable()
export class DetalleVentaService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    @InjectRepository(Venta)
    private readonly ventaRepo: Repository<Venta>,
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
      const subtotal = (createDto.cantidad * Number(createDto.precio_unitario)).toFixed(2);
      const detalle = this.detalleRepo.create({
        venta,
        producto,
        cantidad: createDto.cantidad,
        precio_unitario: createDto.precio_unitario,
        subtotal,
      } as any);
      return await this.detalleRepo.save(detalle);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo crear el detalle de venta');
    }
  }

  findAll() {
    return this.detalleRepo.find();
  }

  async findOne(id: number) {
    const det = await this.detalleRepo.findOneBy({ id });
    if (!det) throw new NotFoundException(`DetalleVenta con id ${id} no existe`);
    return det;
  }

  async update(id: number, updateDto: UpdateDetalleVentaDto) {
    let venta;
    let producto;
    if ((updateDto as any).id_venta) {
      venta = await this.ventaRepo.findOneBy({ id: (updateDto as any).id_venta });
      if (!venta) {
        throw new NotFoundException(`Venta con id ${(updateDto as any).id_venta} no existe`);
      }
    }
    if ((updateDto as any).id_producto) {
      producto = await this.productoRepo.findOneBy({ id: (updateDto as any).id_producto });
      if (!producto) throw new NotFoundException(`Producto con id ${(updateDto as any).id_producto} no existe`);
    }
    const { id_producto, id_venta, ...rest } = updateDto as any;
    const subtotal = rest.cantidad && rest.precio_unitario ? (rest.cantidad * Number(rest.precio_unitario)).toFixed(2) : undefined;
    const detalle = await this.detalleRepo.preload({ id, ...(rest as any), ...(venta && { venta }), ...(producto && { producto }), ...(subtotal && { subtotal }) });
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
    const det = await this.findOne(id);
    await this.detalleRepo.remove(det);
    return 'DetalleVenta eliminado exitosamente';
  }
}
