import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { VentaService } from './venta.service';
import { generarFacturaHtml } from './factura-html';

@Controller('venta')
export class VentaPublicoController {
  constructor(private readonly ventaService: VentaService) {}

  @Get(':id/verificar')
  async verificar(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const venta = await this.ventaService.findOne(id);
    res.type('html').send(generarFacturaHtml(venta));
  }
}
