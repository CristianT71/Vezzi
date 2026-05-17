import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetalleVentaDto {
  @IsInt()
  @IsNotEmpty()
  id_venta: number;

  @IsInt()
  @IsNotEmpty()
  id_producto: number;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  precio_unitario: number;
}
