import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class HistorialStock {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Producto, { nullable: false, eager: true })
	@JoinColumn({ name: 'id_producto' })
	producto: Producto;

	@Column({ type: 'varchar', length: 30 })
	tipo_movimiento: string;

	@Column({ type: 'int' })
	cantidad: number;

	@Column({ type: 'int' })
	stock_anterior: number;

	@Column({ type: 'int' })
	stock_nuevo: number;

	@Column({ type: 'varchar', length: 255, nullable: true })
	observacion: string;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	fecha_movimiento: Date;

	@Column({ type: 'boolean', default: true })
	activo: boolean;
}
