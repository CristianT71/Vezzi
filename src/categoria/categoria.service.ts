import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto as any);
      return await this.categoriaRepository.save(categoria);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: No se pudo crear la categoria');
    }
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [ data, total ] = await this.categoriaRepository.findAndCount({
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
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({ id, deleteAt: IsNull() });
    if (!categoria) {
      throw new NotFoundException(`Categoria con id ${id} no existe`);
    }
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.preload({ id, ...(updateCategoriaDto as any) });
    if (!categoria) {
      throw new NotFoundException(`Categoria con id ${id} no existe`);
    }
    try {
      await this.categoriaRepository.save(categoria);
      return categoria;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar la categoria');
    }
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.softDelete(categoria);
    return 'Categoria eliminada exitosamente';
  }

  async restaurar(id: number) {
    const categoria = await this.categoriaRepository.findOneBy({ id });
    if (!categoria) {
      throw new NotFoundException(`Categoria con id ${id} no existe`);
    }
    await this.categoriaRepository.restore(id);
    return 'Categoria restaurado exitosamente';
}
}
