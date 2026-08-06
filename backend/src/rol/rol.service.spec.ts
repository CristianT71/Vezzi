import { NotFoundException } from '@nestjs/common';
import { RolService } from './rol.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('RolService', () => {
  let service: RolService;
  let repo: MockRepository;

  beforeEach(() => {
    repo = createMockRepository();
    service = new RolService(repo as any);
  });

  describe('remove', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      repo.findOneBy.mockResolvedValue({ id: 'rol-1', nombre: 'vendedor' });

      await service.remove('rol-1');

      expect(repo.softDelete).toHaveBeenCalledWith('rol-1');
    });

    it('devuelve un objeto JSON serializable', async () => {
      repo.findOneBy.mockResolvedValue({ id: 'rol-1' });

      const resultado = await service.remove('rol-1');

      expect(resultado).toEqual({ message: 'Rol eliminado con exito' });
    });

    it('lanza NotFoundException si el rol no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('no-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restaurar', () => {
    it('restaura pasando el id', async () => {
      repo.findOneBy.mockResolvedValue({ id: 'rol-1' });

      const resultado = await service.restaurar('rol-1');

      expect(repo.restore).toHaveBeenCalledWith('rol-1');
      expect(resultado).toEqual({ message: 'Rol restaurado exitosamente' });
    });
  });
});
