import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  ejecutar() {
    return this.seedService.ejecutar();
  }
}