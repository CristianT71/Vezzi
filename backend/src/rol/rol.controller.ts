import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { RolService } from './rol.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('rol')
@UseGuards(JwtAuthGuard)
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Post()
  create(@Body() createRolDto: CreateRolDto) {
    return this.rolService.create(createRolDto);
  }

  @Get()
  findAll(@Query() PaginacionDto: PaginacionDto) {
    return this.rolService.findAll(PaginacionDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRolDto: UpdateRolDto) {
    return this.rolService.update(id, updateRolDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolService.restaurar(id);
  }
}
