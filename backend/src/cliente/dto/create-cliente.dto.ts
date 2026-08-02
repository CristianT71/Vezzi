import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  telefono: string;

  @IsString()
  @IsOptional()
  nit?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  saldo_deuda: number;

  @IsBoolean()
  @IsOptional()
  activo: boolean;
}
