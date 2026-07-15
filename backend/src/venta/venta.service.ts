import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';
import { DetalleVenta } from 'src/detalle-venta/entities/detalle-venta.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
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
        where: {},
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
        total: 0,
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
    const { page = 1, limit = 10, search } = PaginacionDto;
    const query = this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoinAndSelect('venta.cliente', 'cliente')
      .where('venta.deletedAt IS NULL');


    if (search) {
      query.andWhere('(venta.numero_venta LIKE :search OR cliente.nombre LIKE :search)', { search: `%${search}%` });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('venta.id', 'DESC')
      .getManyAndCount();
  
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit), } };
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

    if (updateVentaDto.id_cliente) {
      cliente = await this.clienteRepository.findOneBy({ id: updateVentaDto.id_cliente });
      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${updateVentaDto.id_cliente} no existe`);
      }
    }

    if (updateVentaDto.id_usuario) {
      usuario = await this.usuarioRepository.findOneBy({ id: updateVentaDto.id_usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${updateVentaDto.id_usuario} no existe`);
      }
    }

    const { id_cliente, id_usuario, fecha_venta, ...ventaData } = updateVentaDto;
    const venta = await this.ventaRepository.preload({
      id,
      ...ventaData,
      ...(cliente && { cliente }),
      ...(usuario && { usuario }),
      ...(fecha_venta && { fecha_venta: new Date(fecha_venta) }),
    } as any);

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

  async calcularTotal(id: number) {
    const detalles = await this.detalleVentaRepository.find({
      where: { venta: { id }},
    });

    const total = detalles.reduce((sum, det) => sum + Number(det.subtotal), 0);

    await this.ventaRepository.update(id, { total: total.toFixed(2) });

    return total.toFixed(2);
  }


  async sumVentasHoy(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.fecha_venta >= :hoy', { hoy })
      .andWhere('venta.fecha_venta < :manana', { manana })
      .getRawOne();

    return Number(result.total);
  }

  async sumIngresosMes(): Promise<number> {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.fecha_venta >= :inicioMes', { inicioMes })
      .getRawOne();

    return Number(result.total);
  }

  async findUltimasVentas(limit: number = 5) {
    return this.ventaRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['cliente'],
      order: { fecha_venta: 'DESC', id: 'DESC' },
      take: limit,
      });
    }
  
  async sumVentasAyer(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
  
    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.fecha_venta >= :ayer', { ayer })
      .andWhere('venta.fecha_venta < :hoy', { hoy })
      .getRawOne();
  
    return Number(result.total);
  }
  
  async getVentasSemana(): Promise<{ fecha: string; total: number }[]> {
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() - 6);
    hace7Dias.setHours(0, 0, 0, 0);
  
    const ventas = await this.ventaRepository
      .createQueryBuilder('venta')
      .select("TO_CHAR(venta.fecha_venta, 'YYYY-MM-DD')", 'fecha')
      .addSelect('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.fecha_venta >= :hace7Dias', { hace7Dias })
      .groupBy('fecha')
      .orderBy('fecha', 'ASC')
      .getRawMany();
  
    return ventas;
  }
  
  async getIngresosMensuales(): Promise<{ mes: string; total: number }[]> {
    const hoy = new Date();
    const hace6Meses = new Date(hoy.getFullYear(), hoy.getMonth() - 5, 1);
  
    const ingresos = await this.ventaRepository
      .createQueryBuilder('venta')
      .select("TO_CHAR(venta.fecha_venta, 'YYYY-MM')", 'mes')
      .addSelect('COALESCE(SUM(venta.total), 0)', 'total')
      .where('venta.deletedAt IS NULL')
      .andWhere('venta.fecha_venta >= :hace6Meses', { hace6Meses })
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();
  
    return ingresos;
  }

}
