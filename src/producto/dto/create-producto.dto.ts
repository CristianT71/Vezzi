import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  costo: number;

  @IsNumber()
  @IsNotEmpty()
  precio_venta: number;

  @IsNumber()
  @IsOptional()
  stock: number;

  @IsNumber()
  @IsOptional()
  stock_minimo: number;

  @IsNumber()
  @IsNotEmpty()
  id_categoria: number;

  @IsBoolean()
  @IsOptional()
  activo: boolean;
}
export class CreateProductoDto {}
