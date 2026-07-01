import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Venta } from 'src/venta/entities/venta.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class PagoService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    try {
      const venta = await this.ventaRepository.findOneBy({ id: createPagoDto.id_venta });
      if (!venta) {
        throw new NotFoundException(`Venta con id ${createPagoDto.id_venta} no existe`);
      }

      const cliente = await this.clienteRepository.findOneBy({ id: createPagoDto.id_cliente });
      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${createPagoDto.id_cliente} no existe`);
      }

      const usuario = await this.usuarioRepository.findOneBy({ id: createPagoDto.id_usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${createPagoDto.id_usuario} no existe`);
      }

      const pago = this.pagoRepository.create({
        venta,
        cliente,
        usuario,
        monto: createPagoDto.monto,
        metodo_pago: createPagoDto.metodo_pago,
        referencia: createPagoDto.referencia,
        fecha_pago: createPagoDto.fecha_pago ? new Date(createPagoDto.fecha_pago) : new Date(),
        estado: createPagoDto.estado ?? 'REGISTRADO',
        activo: createPagoDto.activo ?? true,
      } as any);

      const pagoGuardado = await this.pagoRepository.save(pago);

      const deudaActual = Number(cliente.saldo_deuda);
      cliente.saldo_deuda = (deudaActual - Number(createPagoDto.monto)).toFixed(2);
      await this.clienteRepository.save(cliente);

      return pagoGuardado;

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo crear el pago');
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10} = PaginacionDto;
    const [data, total] = await this.pagoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data,
      meta: {
        total,
        page,
        limit,
        TotalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const pago = await this.pagoRepository.findOneBy({ id });
    if (!pago) {
      throw new NotFoundException(`Pago con id ${id} no existe`);
    }
    return pago;
  }

  async update(id: number, updatePagoDto: UpdatePagoDto) {
    let venta;
    let cliente;
    let usuario;

    if ((updatePagoDto as any).id_venta) {
      venta = await this.ventaRepository.findOneBy({ id: (updatePagoDto as any).id_venta });
      if (!venta) {
        throw new NotFoundException(`Venta con id ${(updatePagoDto as any).id_venta} no existe`);
      }
    }

    if ((updatePagoDto as any).id_cliente) {
      cliente = await this.clienteRepository.findOneBy({ id: (updatePagoDto as any).id_cliente });
      if (!cliente) {
        throw new NotFoundException(`Cliente con id ${(updatePagoDto as any).id_cliente} no existe`);
      }
    }

    if ((updatePagoDto as any).id_usuario) {
      usuario = await this.usuarioRepository.findOneBy({ id: (updatePagoDto as any).id_usuario });
      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${(updatePagoDto as any).id_usuario} no existe`);
      }
    }

    const { id_venta, id_cliente, id_usuario, fecha_pago, ...pagoData } = updatePagoDto as any;
    const pago = await this.pagoRepository.preload({
      id,
      ...(pagoData as any),
      ...(venta && { venta }),
      ...(cliente && { cliente }),
      ...(usuario && { usuario }),
      ...(fecha_pago && { fecha_pago: new Date(fecha_pago) }),
    });

    if (!pago) {
      throw new NotFoundException(`Pago con id ${id} no existe`);
    }

    try {
      await this.pagoRepository.save(pago);
      return pago;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar el pago');
    }
  }

  async remove(id: number) {
    const pago = await this.findOne(id);
    await this.pagoRepository.remove(pago);
    return 'Pago eliminado exitosamente';
  }
}
