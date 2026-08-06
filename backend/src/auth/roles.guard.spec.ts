import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

function crearContextoFalso(user: { rol?: string } | undefined): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: jest.Mock };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('permite el paso si la ruta no exige ningun rol', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    expect(guard.canActivate(crearContextoFalso({ rol: 'vendedor' }))).toBe(true);
  });

  it('permite el paso si el rol del usuario coincide con el requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    expect(guard.canActivate(crearContextoFalso({ rol: 'admin' }))).toBe(true);
  });

  it('compara el rol sin importar mayusculas/minusculas', () => {
    reflector.getAllAndOverride.mockReturnValue(['Admin']);

    expect(guard.canActivate(crearContextoFalso({ rol: 'ADMIN' }))).toBe(true);
  });

  it('rechaza con ForbiddenException si el rol del usuario no esta permitido', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    expect(() => guard.canActivate(crearContextoFalso({ rol: 'vendedor' }))).toThrow(ForbiddenException);
  });

  it('rechaza si el usuario no tiene rol en el request', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    expect(() => guard.canActivate(crearContextoFalso(undefined))).toThrow(ForbiddenException);
  });
});
