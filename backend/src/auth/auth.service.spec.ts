import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createMockRepository, MockRepository } from '../common/testing/mock-repository';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usuarioRepo: MockRepository;
  let jwtService: { sign: jest.Mock };

  beforeEach(() => {
    usuarioRepo = createMockRepository();
    jwtService = { sign: jest.fn().mockReturnValue('token-firmado') };
    service = new AuthService(usuarioRepo as any, jwtService as any);
    jest.clearAllMocks();
  });

  it('el payload del JWT lleva el NOMBRE del rol, no su UUID', async () => {
    usuarioRepo.findOne.mockResolvedValue({
      id: 'user-1',
      nombre_usuario: 'admin',
      password: 'hash',
      nombre_completo: 'Administrador',
      activo: true,
      rol: { id: 'uuid-del-rol', nombre: 'admin' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await service.login('admin', 'admin123');

    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-1', rol: 'admin' });
  });

  it('lanza UnauthorizedException si el usuario no existe', async () => {
    usuarioRepo.findOne.mockResolvedValue(null);

    await expect(service.login('no-existe', 'x')).rejects.toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si la contraseña no coincide', async () => {
    usuarioRepo.findOne.mockResolvedValue({
      id: 'user-1',
      password: 'hash',
      rol: { id: 'uuid', nombre: 'admin' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.login('admin', 'incorrecta')).rejects.toThrow(UnauthorizedException);
  });
});
