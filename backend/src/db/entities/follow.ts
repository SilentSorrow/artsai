import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('follow')
export class Follow {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
