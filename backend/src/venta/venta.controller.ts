import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('venta')
@UseGuards(JwtAuthGuard)
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get()
  findAll(@Query() PaginacionDto: PaginacionDto) {
    return this.ventaService.findAll(PaginacionDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.restaurar(id);
  }

  @Post(':id/calcular-total')
  calcularTotal(@Param('id', ParseIntPipe) id: number) {
    return this.ventaService.calcularTotal(id);
  }

  @Get('ventas-hoy')
    async ventasHoy() {
      return { total: await this.ventaService.sumVentasHoy() };
    }

  @Get('ingresos-mes')
    async ingresosMes() {
      return { total: await this.ventaService.sumIngresosMes() };
    }

  @Get('ultimas-ventas')
    async ultimasVentas() {
      return this.ventaService.findUltimasVentas(5);
    }
}
