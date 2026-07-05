import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('producto')
@UseGuards(JwtAuthGuard)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() paginacionDto: PaginacionDto) {
    return this.productoService.findAll(paginacionDto);
  }

  @Get('stock-critico')
  async stockCritico() {
    return { total: await this.productoService.countStockCritico() };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.restaurar(id);
  }
}