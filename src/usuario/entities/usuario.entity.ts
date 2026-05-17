import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 50})
    nombre_usuario: string;

    @Column({type: 'varchar', length: 255, select: false})
    password: string;

    @Column({type: 'varchar', length: 155})
    nombre_completo: string;

    @Column({type: 'boolean', default: true})
    activo: boolean;
}
