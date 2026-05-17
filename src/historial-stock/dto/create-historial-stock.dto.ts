import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateHistorialStockDto {
	@IsInt()
	@IsNotEmpty()
	id_producto: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	tipo_movimiento: string;

	@IsInt()
	@IsNotEmpty()
	cantidad: number;

	@IsInt()
	@IsNotEmpty()
	stock_anterior: number;

	@IsInt()
	@IsNotEmpty()
	stock_nuevo: number;

	@IsString()
	@IsOptional()
	@MaxLength(255)
	observacion: string;
}
