import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rol {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 20})
    nombre: string;

    @Column({type: 'text', nullable: true})
    descripcion: string;

    @Column({type: 'boolean', default: true})
    activo: boolean;

    //relaciones

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    usuarios: Usuario[];
}
