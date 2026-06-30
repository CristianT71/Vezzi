import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('detalle-venta')
@UseGuards(JwtAuthGuard)
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}

  @Post()
  create(@Body() createDto: CreateDetalleVentaDto) {
    return this.detalleVentaService.create(createDto);
  }

  @Get()
  findAll() {
    return this.detalleVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDetalleVentaDto) {
    return this.detalleVentaService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.detalleVentaService.remove(id);
  }
}
