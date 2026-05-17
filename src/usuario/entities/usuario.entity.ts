import { Rol } from "src/rol/entities/rol.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from 'src/venta/entities/venta.entity';
import { Pago } from 'src/pago/entities/pago.entity';

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

    //relaciones

    @ManyToOne(() => Rol, (rol) => rol.usuarios, {nullable: false, eager: true})
    @JoinColumn({name: 'id_rol'})
    rol: Rol;

    @OneToMany(() => Venta, (venta) => venta.usuario)
    ventas: Venta[];

    @OneToMany(() => Pago, (pago) => pago.usuario)
    pagos: Pago[];
}
