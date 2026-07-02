import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { HistorialStockService } from './historial-stock.service';
import { CreateHistorialStockDto } from './dto/create-historial-stock.dto';
import { UpdateHistorialStockDto } from './dto/update-historial-stock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('historial-stock')
@UseGuards(JwtAuthGuard)
export class HistorialStockController {
  constructor(private readonly historialStockService: HistorialStockService) {}

  @Post()
  create(@Body() createHistorialStockDto: CreateHistorialStockDto) {
    return this.historialStockService.create(createHistorialStockDto);
  }

  @Get()
  findAll(@Query() PaginacionDto: PaginacionDto) {
    return this.historialStockService.findAll(PaginacionDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.historialStockService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHistorialStockDto: UpdateHistorialStockDto) {
    return this.historialStockService.update(id, updateHistorialStockDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.historialStockService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.historialStockService.restaurar(id);
  }
}
