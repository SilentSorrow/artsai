import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Art, User } from '.';
import { OmitedUser } from '../../types';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Art, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'art_id' })
  art: Art;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | OmitedUser;
}
