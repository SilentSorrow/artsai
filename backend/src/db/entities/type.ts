import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Art } from '.';

@Entity('type')
export class Type {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'value', type: 'varchar', length: 255 })
  value: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => Type, (type) => type.art)
  art: Art;
}
