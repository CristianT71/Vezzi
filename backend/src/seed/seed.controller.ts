import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

// Publico e idempotente a proposito: es el unico mecanismo para crear el
// primer admin en una base de datos nueva (no hay nadie con sesion todavia
// para autenticarse). No crea un admin nuevo si ya existe uno, y la
// contraseña que asigna depende de ADMIN_DEFAULT_PASSWORD -- por eso esa
// variable debe quedar en un valor real en produccion, no en el default.
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  ejecutar() {
    return this.seedService.ejecutar();
  }
}