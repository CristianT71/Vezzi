import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

        @IsString()
        @IsNotEmpty()
        @MaxLength(50)
        nombre_usuario: string;

        @IsString()
        @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
        password: string;

        @IsString()
        @IsNotEmpty()
        @MaxLength(155)
        nombre_completo: string;

        @IsBoolean()
        @IsOptional()
        activo: boolean;
}
