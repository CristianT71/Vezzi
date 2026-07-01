import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.id_categoria });
      if (!categoria) {
        throw new NotFoundException(`Categoria con id ${createProductoDto.id_categoria} no existe`);
      }
      const { id_categoria, ...productoData } = createProductoDto as any;
      const producto = this.productoRepository.create({ ...productoData, categoria });
      return await this.productoRepository.save(producto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: No se pudo crear el producto');
    }
  }

  async findAll(paginacionDto: PaginacionDto) {
    const { page = 1, limit = 10  } = paginacionDto;
    const [ data, total ] = await this.productoRepository.findAndCount({
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
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    let categoria;
    if ((updateProductoDto as any).id_categoria) {
      categoria = await this.categoriaRepository.findOneBy({ id: (updateProductoDto as any).id_categoria });
      if (!categoria) {
        throw new NotFoundException(`Categoria con id ${(updateProductoDto as any).id_categoria} no existe`);
      }
    }
    const { id_categoria, ...productoData } = updateProductoDto as any;
    const producto = await this.productoRepository.preload({ id, ...(productoData as any), ...(categoria && { categoria }) });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }
    try {
      await this.productoRepository.save(producto);
      return producto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error: no se pudo actualizar el producto');
    }
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return 'Producto eliminado exitosamente';
  }
}
