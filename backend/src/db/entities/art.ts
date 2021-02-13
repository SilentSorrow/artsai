import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Subject, Tag, Type, User } from '.';

@Entity('art')
export class Art {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({ name: 'main_image_path', type: 'varchar', length: 255 })
  mainImage: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Type, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: Type;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Tag, (tag) => tag.art)
  tags: Tag[];

  @ManyToMany(() => Subject, (subject) => subject.arts)
  subjects: Subject[];
}
