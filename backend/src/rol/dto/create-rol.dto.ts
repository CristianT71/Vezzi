import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRolDto {

        @IsString()
        @IsNotEmpty()
        @MaxLength(20)
        nombre: string;

        @IsString()
        @IsOptional()
        descripcion: string;

        @IsBoolean()
        @IsOptional()
        activo: boolean;
}
