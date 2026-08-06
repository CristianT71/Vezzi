import { NotFoundException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('ClienteService', () => {
  let service: ClienteService;
  let repo: MockRepository;

  beforeEach(() => {
    repo = createMockRepository();
    service = new ClienteService(repo as any);
  });

  describe('remove', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      repo.findOneBy.mockResolvedValue({ id: 8, nombre: 'Cristian Trujillo' });

      await service.remove(8);

      expect(repo.softDelete).toHaveBeenCalledWith(8);
      expect(repo.softDelete).not.toHaveBeenCalledWith(expect.objectContaining({ id: 8 }));
    });

    it('devuelve un objeto JSON serializable', async () => {
      repo.findOneBy.mockResolvedValue({ id: 8 });

      const resultado = await service.remove(8);

      expect(resultado).toEqual({ message: 'Cliente eliminado exitosamente' });
    });

    it('lanza NotFoundException si el cliente no existe', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('restaurar', () => {
    it('restaura pasando el id', async () => {
      repo.findOneBy.mockResolvedValue({ id: 8 });

      const resultado = await service.restaurar(8);

      expect(repo.restore).toHaveBeenCalledWith(8);
      expect(resultado).toEqual({ message: 'Cliente restaurado exitosamente' });
    });
  });

  describe('create', () => {
    it('guarda los campos fiscales (nit, direccion, email) al crear', async () => {
      const dto = {
        nombre: 'Cliente Nuevo',
        telefono: '3001234567',
        nit: '900123456-7',
        direccion: 'Calle 10 # 5-20',
        email: 'cliente@correo.com',
      } as any;

      await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({
        nombre: 'Cliente Nuevo',
        telefono: '3001234567',
        nit: '900123456-7',
        direccion: 'Calle 10 # 5-20',
        email: 'cliente@correo.com',
        activo: true,
      });
    });
  });
});
