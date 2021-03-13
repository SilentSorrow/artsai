import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Art, User } from '.';
import { OmitedUser } from '../../types';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'value', type: 'varchar', length: 255 })
  value: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Art, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'art_id' })
  art: Art;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | OmitedUser;
}
