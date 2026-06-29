import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credenciales: { nombre_usuario: string; password: string }) {
    return this.authService.login(credenciales.nombre_usuario, credenciales.password);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  getPerfil(@CurrentUser() user: { id: string; id_rol: string }) {
    return user;
  }
}