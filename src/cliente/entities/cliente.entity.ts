import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Venta } from 'src/venta/entities/venta.entity';
import { Pago } from 'src/pago/entities/pago.entity';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  saldo_deuda: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_registro: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];

  @OneToMany(() => Pago, (pago) => pago.cliente)
  pagos: Pago[];
}
