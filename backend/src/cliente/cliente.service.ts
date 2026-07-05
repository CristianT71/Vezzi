import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create({
        nombre: createClienteDto.nombre,
        telefono: createClienteDto.telefono,
        activo: createClienteDto.activo ?? true,
      });
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: No se pudo crear el cliente');
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [ data, total ] = await this.clienteRepository.findAndCount({
      where: { deleteAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
    };
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id, deleteAt: IsNull() });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no existe`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.preload({ id, ...updateClienteDto } as any);
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no existe`);
    }
    try {
      await this.clienteRepository.save(cliente);
      return cliente;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar el cliente');
    }
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.softDelete(cliente);
    return 'Cliente eliminado exitosamente';
  }

  async restaurar(id: number) {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) {
      throw new NotFoundException(`Cliente con id ${id} no existe`);
    }
    await this.clienteRepository.restore(id);
    return 'Cliente restaurado exitosamente';
  }

  async countClientesNuevos(): Promise<number> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    
    return this.clienteRepository.count({
      where: { deleteAt: IsNull(), fecha_registro: MoreThanOrEqual(hoy) }, // clientes registrados hoy
    });
  }
}
