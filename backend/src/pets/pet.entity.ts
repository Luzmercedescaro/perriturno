import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 100 })
  size: string;

  @Column({ length: 500, nullable: true })
  observations?: string;

  @ManyToOne(() => User, (user) => user.pets, { eager: false, onDelete: 'CASCADE' })
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
