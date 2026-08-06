import { NotFoundException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('ProductoService', () => {
  let service: ProductoService;
  let productoRepo: MockRepository;
  let categoriaRepo: MockRepository;

  beforeEach(() => {
    productoRepo = createMockRepository();
    categoriaRepo = createMockRepository();
    service = new ProductoService(productoRepo as any, categoriaRepo as any);
  });

  describe('remove', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      productoRepo.findOneBy.mockResolvedValue({ id: 2, nombre: 'Mouse inalámbrico' });

      await service.remove(2);

      expect(productoRepo.softDelete).toHaveBeenCalledWith(2);
    });

    it('devuelve un objeto JSON serializable', async () => {
      productoRepo.findOneBy.mockResolvedValue({ id: 2 });

      const resultado = await service.remove(2);

      expect(resultado).toEqual({ message: 'Producto eliminado exitosamente' });
    });

    it('lanza NotFoundException si el producto no existe', async () => {
      productoRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restaurar', () => {
    it('restaura pasando el id', async () => {
      productoRepo.findOneBy.mockResolvedValue({ id: 2 });

      const resultado = await service.restaurar(2);

      expect(productoRepo.restore).toHaveBeenCalledWith(2);
      expect(resultado).toEqual({ message: 'Producto restaurado exitosamente' });
    });
  });

  describe('create', () => {
    it('lanza NotFoundException si la categoria indicada no existe', async () => {
      categoriaRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({ id_categoria: 999, nombre: 'X', codigo: 'X', costo: 1, precio_venta: 2, stock: 1 } as any),
      ).rejects.toThrow('Error: No se pudo crear el producto');
    });

    it('crea el producto con la categoria encontrada', async () => {
      const categoria = { id: 4, nombre: 'Hogar' };
      categoriaRepo.findOneBy.mockResolvedValue(categoria);

      await service.create({
        id_categoria: 4,
        nombre: 'Producto X',
        codigo: 'COD-1',
        costo: 100,
        precio_venta: 200,
        stock: 10,
      } as any);

      expect(productoRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'Producto X', categoria }),
      );
    });
  });
});
