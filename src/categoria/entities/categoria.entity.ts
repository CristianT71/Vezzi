import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
