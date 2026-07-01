import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Rol } from 'src/rol/entities/rol.entity';
import { PaginacionDto } from 'src/common/dto/paginacion.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ){}
  async create(createUsuarioDto: CreateUsuarioDto) {
    try{
      const rol = await this.rolRepository.findOneBy({ id: createUsuarioDto.id_rol });

      if (!rol) {
        throw new NotFoundException(`Rol con id ${createUsuarioDto.id_rol} no existe`);
      }

      const passwordHash = await hash(createUsuarioDto.password, 10);
      const { id_rol, ...usuarioData } = createUsuarioDto;
      const usuario = this.usuarioRepository.create({
        ...usuarioData,
        password: passwordHash,
        rol,
      });
      return await this.usuarioRepository.save(usuario);
    } catch(error){
      console.log(error);
      throw new InternalServerErrorException('Error: No se pudo crear el usuario')
    } 
  }

  async findAll(PaginacionDto: PaginacionDto) {
    const { page = 1, limit = 10 } = PaginacionDto;
    const [data, total] = await this.usuarioRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    })
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total - limit),
      },
    };
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOneBy( {id} );
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no existe`)
    }
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.password){
      updateUsuarioDto.password = await hash(updateUsuarioDto.password, 10);
    }

    let rol: Rol | null = null;
    if (updateUsuarioDto.id_rol) {
      rol = await this.rolRepository.findOneBy({ id: updateUsuarioDto.id_rol });

      if (!rol) {
        throw new NotFoundException(`Rol con id ${updateUsuarioDto.id_rol} no existe`);
      }
    }

    const { id_rol, ...usuarioData } = updateUsuarioDto;

    const usuario = await this.usuarioRepository.preload({
      id,
      ...usuarioData,
      ...(rol && { rol }),
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no existe`);
    }
    try {
      await this.usuarioRepository.save(usuario)
      return usuario;
    } catch (error){
      console.log(error)
      throw new InternalServerErrorException('Error: no se pudo actualizar el usuario')
    }
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    await this.usuarioRepository.remove(usuario);
    return 'Usuario eliminado exitosamente'
  }
}