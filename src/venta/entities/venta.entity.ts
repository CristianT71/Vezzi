import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { DetalleVenta } from 'src/detalle-venta/entities/detalle-venta.entity';
import { Pago } from 'src/pago/entities/pago.entity';

@Entity()
export class Venta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 30, unique: true })
	numero_venta: string;

	@ManyToOne(() => Cliente, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_cliente' })
	cliente: Cliente;

	@ManyToOne(() => Usuario, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_usuario' })
	usuario: Usuario;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	fecha_venta: Date;

	@Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
	impuesto: string;

	@Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
	total: string;

	@Column({ type: 'varchar', length: 20, default: 'EMITIDA' })
	estado: string;

	@Column({ type: 'boolean', default: true })
	activo: boolean;

	@OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta)
	detalles_venta: DetalleVenta[];

	@OneToMany(() => Pago, (pago) => pago.venta)
	pagos: Pago[];
}
