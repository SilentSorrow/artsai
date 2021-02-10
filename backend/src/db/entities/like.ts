import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
