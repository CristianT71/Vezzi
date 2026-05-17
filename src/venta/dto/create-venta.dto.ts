import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, IsUUID } from 'class-validator';

export class CreateVentaDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	numero_venta: string;

	@IsNumber()
	@IsNotEmpty()
	id_cliente: number;

	@IsUUID()
	@IsNotEmpty()
	id_usuario: string;

	@IsDateString()
	@IsOptional()
	fecha_venta: string;

	@IsNumber()
	@IsNotEmpty()
	impuesto: number;

	@IsNumber()
	@IsNotEmpty()
	total: number;

	@IsString()
	@IsOptional()
	@MaxLength(20)
	estado: string;

	@IsOptional()
	activo: boolean;
}
