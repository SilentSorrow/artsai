import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Art } from '.';

@Entity('subject')
export class Subject {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'value', type: 'varchar', length: 255 })
  value: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToMany(() => Art, (art) => art.subjects)
  @JoinTable()
  art: Art[];
}
