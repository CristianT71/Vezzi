import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    try {
      const cliente = await this.clienteRepository.findOneBy({ id: createVentaDto.id_cliente });
      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${createVentaDto.id_cliente} no existe`);
      }

      const usuario = await this.usuarioRepository.findOneBy({ id: createVentaDto.id_usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${createVentaDto.id_usuario} no existe`);
      }

      const ultimaVenta = await this.ventaRepository.findOne({
        order: { id: 'DESC' },
      });

      const siguienteNumero = ultimaVenta
        ? parseInt(ultimaVenta.numero_venta.split('-')[1]) + 1
        : 1;
        const numero_venta = `VZ-${String(siguienteNumero).padStart(6, '0')}`;

      const venta = this.ventaRepository.create({
        numero_venta,
        cliente,
        usuario,
        fecha_venta: createVentaDto.fecha_venta ? new Date(createVentaDto.fecha_venta) : new Date(),
        impuesto: createVentaDto.impuesto,
        total: createVentaDto.total,
        estado: createVentaDto.estado ?? 'EMITIDA',
        activo: createVentaDto.activo ?? true,
      } as any);

      return await this.ventaRepository.save(venta);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo crear la venta');
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [data, total] = await this.ventaRepository.findAndCount({
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
    const venta = await this.ventaRepository.findOneBy({ id, deletedAt: IsNull() });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no existe`);
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    let cliente;
    let usuario;

    if ((updateVentaDto as any).id_cliente) {
      cliente = await this.clienteRepository.findOneBy({ id: (updateVentaDto as any).id_cliente });
      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${(updateVentaDto as any).id_cliente} no existe`);
      }
    }

    if ((updateVentaDto as any).id_usuario) {
      usuario = await this.usuarioRepository.findOneBy({ id: (updateVentaDto as any).id_usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${(updateVentaDto as any).id_usuario} no existe`);
      }
    }

    const { id_cliente, id_usuario, fecha_venta, ...ventaData } = updateVentaDto as any;
    const venta = await this.ventaRepository.preload({
      id,
      ...(ventaData as any),
      ...(cliente && { cliente }),
      ...(usuario && { usuario }),
      ...(fecha_venta && { fecha_venta: new Date(fecha_venta) }),
    });

    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no existe`);
    }

    try {
      await this.ventaRepository.save(venta);
      return venta;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar la venta');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.ventaRepository.softDelete(id);
    return 'Venta eliminada exitosamente';
  }

  async restaurar(id: number) {
    const venta = await this.ventaRepository.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no existe`);
    }
    await this.ventaRepository.restore(id);
    return 'Venta restaurada exitosamente';
  }
}
