import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePagoDto {
	@IsNumber()
	@IsNotEmpty()
	id_venta: number;

	@IsNumber()
	@IsNotEmpty()
	id_cliente: number;

	@IsUUID()
	@IsNotEmpty()
	id_usuario: string;

	@IsNumber()
	@IsNotEmpty()
	monto: number;

	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	metodo_pago: string;

	@IsString()
	@IsOptional()
	@MaxLength(80)
	referencia: string;

	@IsDateString()
	@IsOptional()
	fecha_pago: string;

	@IsString()
	@IsOptional()
	@MaxLength(20)
	estado: string;

	@IsOptional()
	activo: boolean;
}
