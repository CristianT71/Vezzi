import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  controllers: [RolController],
  providers: [RolService],
  imports: [
    TypeOrmModule.forFeature([ Rol, Usuario ])
  ]
})
export class RolModule {}
