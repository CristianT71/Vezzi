import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
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
      const passwordHash = await bcrypt.hash('admin123', 10);
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