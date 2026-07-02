import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from '../../venta/entities/venta.entity';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Pago {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Venta, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_venta' })
	venta: Venta;

	@ManyToOne(() => Cliente, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_cliente' })
	cliente: Cliente;

	@ManyToOne(() => Usuario, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_usuario' })
	usuario: Usuario;

	@Column({ type: 'decimal', precision: 12, scale: 2 })
	monto: string;

	@Column({ type: 'varchar', length: 30 })
	metodo_pago: string;

	@Column({ type: 'varchar', length: 80, nullable: true })
	referencia: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	fecha_pago: Date;

	@Column({ type: 'varchar', length: 20, default: 'REGISTRADO' })
	estado: string;

	@Column({ type: 'boolean', default: true })
	activo: boolean;

	@DeleteDateColumn()
	deletedAt?: Date;
}
