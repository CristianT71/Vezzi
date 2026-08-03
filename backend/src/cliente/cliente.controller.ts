import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { DeudaReminderService } from './deuda-reminder.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Controller('cliente')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(
    private readonly clienteService: ClienteService,
    private readonly deudaReminderService: DeudaReminderService,
  ) {}

  @Post('enviar-recordatorios')
  @UseGuards(RolesGuard)
  @Roles('admin')
  enviarRecordatorios() {
    return this.deudaReminderService.enviarRecordatorios();
  }

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  findAll(@Query() PaginacionDto: PaginacionDto ) {
    return this.clienteService.findAll(PaginacionDto);
  }

  @Get('clientes-nuevos')
  async clientesNuevos() {
    return { total: await this.clienteService.countClientesNuevos() };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.remove(id);
  }

  @Patch(':id/restaurar')
  restaurar(@Param('id', ParseIntPipe) id: number) {
    return this.clienteService.restaurar(id);
  }
}