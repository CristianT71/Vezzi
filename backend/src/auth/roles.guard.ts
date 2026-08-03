import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rolesRequeridos) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const rolUsuario = (user?.rol || '').toLowerCase();
    const tieneRol = rolesRequeridos.some((rol) => rolUsuario === rol.toLowerCase());

    if (!tieneRol) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}