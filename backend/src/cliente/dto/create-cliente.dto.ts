import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  telefono: string;

  @IsNumber()
  @IsOptional()
  saldo_deuda: number;

  @IsBoolean()
  @IsOptional()
  activo: boolean;
}
