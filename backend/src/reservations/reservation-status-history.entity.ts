import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Reservation, ReservationStatus } from './reservation.entity';

@Entity('reservation_status_history')
export class ReservationStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Reservation, { nullable: false, onDelete: 'CASCADE' })
  reservation!: Reservation;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    nullable: true,
  })
  previousStatus?: ReservationStatus;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
  })
  newStatus!: ReservationStatus;

  @ManyToOne(() => User, { nullable: false })
  changedBy!: User;

  @CreateDateColumn()
  changedAt!: Date;
}