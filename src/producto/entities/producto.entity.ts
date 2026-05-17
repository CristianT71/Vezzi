import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  costo: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  precio_venta: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  stock_minimo: number;

  @ManyToOne(() => Categoria, { nullable: false, eager: true })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
