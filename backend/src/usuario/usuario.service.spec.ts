import { NotFoundException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let usuarioRepo: MockRepository;
  let rolRepo: MockRepository;

  beforeEach(() => {
    usuarioRepo = createMockRepository();
    rolRepo = createMockRepository();
    service = new UsuarioService(usuarioRepo as any, rolRepo as any);
  });

  describe('remove', () => {
    it('borra pasando el id (no el objeto) al softDelete del repositorio', async () => {
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'uuid-1', nombre_usuario: 'vendedor_test' });

      await service.remove('uuid-1');

      expect(usuarioRepo.softDelete).toHaveBeenCalledWith('uuid-1');
    });

    it('devuelve un objeto JSON serializable', async () => {
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'uuid-1' });

      const resultado = await service.remove('uuid-1');

      expect(resultado).toEqual({ message: 'Usuario eliminado exitosamente' });
    });

    it('lanza NotFoundException si el usuario no existe', async () => {
      usuarioRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('no-existe')).rejects.toThrow(NotFoundException);
    });
  });

  describe('restaurar', () => {
    it('restaura pasando el id', async () => {
      usuarioRepo.findOneBy.mockResolvedValue({ id: 'uuid-1' });

      const resultado = await service.restaurar('uuid-1');

      expect(usuarioRepo.restore).toHaveBeenCalledWith('uuid-1');
      expect(resultado).toEqual({ message: 'Usuario restaurado exitosamente' });
    });
  });

  describe('create', () => {
    it('lanza NotFoundException si el rol indicado no existe', async () => {
      rolRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({ id_rol: 'no-existe', nombre_usuario: 'x', password: 'x', nombre_completo: 'X' } as any),
      ).rejects.toThrow('Error: No se pudo crear el usuario');
    });

    it('hashea la contraseña antes de guardar', async () => {
      rolRepo.findOneBy.mockResolvedValue({ id: 'rol-1', nombre: 'vendedor' });

      await service.create({
        id_rol: 'rol-1',
        nombre_usuario: 'nuevo',
        password: 'plano123',
        nombre_completo: 'Nuevo Usuario',
      } as any);

      const datosCreados = usuarioRepo.create.mock.calls[0][0];
      expect(datosCreados.password).not.toBe('plano123');
      expect(typeof datosCreados.password).toBe('string');
    });
  });
});
