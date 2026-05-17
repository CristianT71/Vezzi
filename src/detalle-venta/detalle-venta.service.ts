import { Injectable } from '@nestjs/common';

@Injectable()
export class DetalleVentaService {
  create() {
    return 'This action adds a new detalle-venta';
  }

  findAll() {
    return `This action returns all detalle-venta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detalle-venta`;
  }

  update(id: number) {
    return `This action updates a #${id} detalle-venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} detalle-venta`;
  }
}
