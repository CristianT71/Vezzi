import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>
  ){}

  async create(createRolDto: CreateRolDto) {
    try {
      const rol = this.rolRepository.create(createRolDto)
      return await this.rolRepository.save(rol)
    } catch (error){
      console.log(error)
      const pgError = error as any;
      if (pgError.code === '23505'){
        throw new BadRequestException('El rol ya existe');
      }
      throw new InternalServerErrorException('Error: No se puede crear el rol')
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [data, total] = await this.rolRepository.findAndCount({
      where: { deletedAt: IsNull() },
      skip: (page - 1) * limit,
      take: limit,
    })
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

  async findOne(id: string) {
    const rol = await this.rolRepository.findOneBy({ id, deletedAt: IsNull() })
    if(!rol) {
      throw new NotFoundException(`Rol con id ${id} no existe`)
    }
    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    const rol = await this.rolRepository.preload({
      id,
      ...updateRolDto,
    });
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no existe`)
    }
    try {
      await this.rolRepository.save(rol)
      return rol;
    } catch (error){
      console.log(error)
      throw new InternalServerErrorException('Error: no se pudo actualizar el rol')
    }
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.rolRepository.softDelete(id)
    return 'Rol eliminado con exito'
  }

  async restaurar(id: string) {
    const rol = await this.rolRepository.findOneBy({ id })
    if (!rol) {
      throw new NotFoundException(`Rol con id ${id} no existe`)
    }
    await this.rolRepository.restore(id)
    return 'Rol restaurado exitosamente'
  }
}
