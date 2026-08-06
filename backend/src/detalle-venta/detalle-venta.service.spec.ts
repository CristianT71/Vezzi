import { BadRequestException } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('DetalleVentaService', () => {
  let service: DetalleVentaService;
  let detalleRepo: MockRepository;
  let productoRepo: MockRepository;
  let ventaRepo: MockRepository;
  let historialRepo: MockRepository;

  beforeEach(() => {
    detalleRepo = createMockRepository();
    productoRepo = createMockRepository();
    ventaRepo = createMockRepository();
    historialRepo = createMockRepository();
    service = new DetalleVentaService(detalleRepo as any, productoRepo as any, ventaRepo as any, historialRepo as any);
  });

  describe('remove — repone el stock al eliminar una línea', () => {
    it('devuelve el stock del producto y registra el historial de entrada', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 93 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 2, producto, venta });

      await service.remove(1);

      expect(producto.stock).toBe(95);
      expect(productoRepo.save).toHaveBeenCalledWith(expect.objectContaining({ stock: 95 }));
      expect(historialRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ tipo_movimiento: 'entrada_ajuste', cantidad: 2, stock_anterior: 93, stock_nuevo: 95 }),
      );
      expect(detalleRepo.softDelete).toHaveBeenCalledWith(1);
    });
  });

  describe('update — mismo producto, cambia la cantidad', () => {
    it('descuenta stock adicional si la cantidad aumenta', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 50 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 2, producto, venta });
      detalleRepo.preload.mockResolvedValue({ id: 1, cantidad: 5 });

      await service.update(1, { cantidad: 5 } as any);

      expect(producto.stock).toBe(47); // 50 - (5-2)
      expect(historialRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ tipo_movimiento: 'salida', cantidad: 3 }),
      );
    });

    it('repone stock si la cantidad disminuye', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 50 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 5, producto, venta });
      detalleRepo.preload.mockResolvedValue({ id: 1, cantidad: 2 });

      await service.update(1, { cantidad: 2 } as any);

      expect(producto.stock).toBe(53); // 50 + (5-2)
      expect(historialRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ tipo_movimiento: 'entrada_ajuste', cantidad: 3 }),
      );
    });

    it('no toca el stock si la cantidad no cambia', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 50 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 5, producto, venta });
      detalleRepo.preload.mockResolvedValue({ id: 1, precio_unitario: 99 });

      await service.update(1, { precio_unitario: 99 } as any);

      expect(productoRepo.save).not.toHaveBeenCalled();
      expect(historialRepo.save).not.toHaveBeenCalled();
    });

    it('rechaza el cambio si no hay stock suficiente para aumentar la cantidad', async () => {
      const producto = { id: 2, nombre: 'Mouse', stock: 1 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 1, producto, venta });

      await expect(service.update(1, { cantidad: 10 } as any)).rejects.toThrow(BadRequestException);
      expect(detalleRepo.preload).not.toHaveBeenCalled();
    });
  });

  describe('update — cambia de producto', () => {
    it('repone el stock del producto anterior y descuenta del nuevo', async () => {
      const productoViejo = { id: 2, nombre: 'Mouse', stock: 50 };
      const productoNuevo = { id: 3, nombre: 'Teclado', stock: 20 };
      const venta = { id: 10 };
      detalleRepo.findOneBy.mockResolvedValue({ id: 1, cantidad: 4, producto: productoViejo, venta });
      productoRepo.findOneBy.mockResolvedValue(productoNuevo);
      detalleRepo.preload.mockResolvedValue({ id: 1, producto: productoNuevo });

      await service.update(1, { id_producto: 3 } as any);

      expect(productoViejo.stock).toBe(54); // se repuso la cantidad anterior
      expect(productoNuevo.stock).toBe(16); // 20 - 4
    });
  });
});
