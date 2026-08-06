import { NotFoundException } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repo: MockRepository;

  beforeEach(() => {
    repo = createMockRepository();
    service = new CategoriaService(repo as any);
  });

  describe('remove', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      repo.findOneBy.mockResolvedValue({ id: 5, nombre: 'Electrónicos' });

      await service.remove(5);

      expect(repo.softDelete).toHaveBeenCalledWith(5);
    });

    it('devuelve un objeto JSON serializable, no un string plano', async () => {
      repo.findOneBy.mockResolvedValue({ id: 5, nombre: 'Electrónicos' });

      const resultado = await service.remove(5);

      expect(resultado).toEqual({ message: 'Categoria eliminada exitosamente' });
    });

    it('lanza NotFoundException si la categoria no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repo.softDelete).not.toHaveBeenCalled();
    });
  });

  describe('restaurar', () => {
    it('restaura pasando el id y devuelve un objeto', async () => {
      repo.findOneBy.mockResolvedValue({ id: 5 });

      const resultado = await service.restaurar(5);

      expect(repo.restore).toHaveBeenCalledWith(5);
      expect(resultado).toEqual({ message: 'Categoria restaurada exitosamente' });
    });

    it('lanza NotFoundException si la categoria no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.restaurar(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('crea y guarda la categoria con activo=true por defecto', async () => {
      const dto = { nombre: 'Nueva', descripcion: 'desc' } as any;

      const resultado = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({
        nombre: 'Nueva',
        descripcion: 'desc',
        activo: true,
      });
      expect(resultado).toMatchObject({ nombre: 'Nueva', activo: true });
    });
  });
});
