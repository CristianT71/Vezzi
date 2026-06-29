import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() credenciales: { nombre_usuario: string; password: string }) {
    return this.authService.login(credenciales.nombre_usuario, credenciales.password);
  }
}