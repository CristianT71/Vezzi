import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async ejecutar() {
    const roles = [
      { nombre: 'admin', descripcion: 'Administrador del sistema' },
      { nombre: 'vendedor', descripcion: 'Vendedor' },
    ];

    for (const rolData of roles) {
      const existe = await this.rolRepository.findOneBy({ nombre: rolData.nombre });
      if (!existe) {
        await this.rolRepository.save(rolData);
      }
    }

    const adminRol = await this.rolRepository.findOneBy({ nombre: 'admin' });
    const adminExiste = await this.usuarioRepository.findOneBy({ nombre_usuario: 'admin' });

    if (!adminExiste && adminRol) {
      let passwordInicial = process.env.ADMIN_DEFAULT_PASSWORD;
      if (!passwordInicial) {
        passwordInicial = randomBytes(9).toString('base64url');
        this.logger.warn(
          `ADMIN_DEFAULT_PASSWORD no definido: se genero una contraseña aleatoria para el usuario 'admin': ${passwordInicial} (cambiala apenas inicies sesion)`,
        );
      }
      const passwordHash = await bcrypt.hash(passwordInicial, 10);
      await this.usuarioRepository.save({
        nombre_usuario: 'admin',
        password: passwordHash,
        nombre_completo: 'Administrador',
        rol: adminRol,
      });
    }

    return { message: 'Seed ejecutado correctamente' };
  }
}