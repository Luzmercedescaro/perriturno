import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Pet } from '../pets/pet.entity';
import { Service } from '../services/service.entity';
import { Schedule } from '../schedules/schedule.entity';

export enum ReservationStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: false })
  client!: User;

  @ManyToOne(() => Pet, { nullable: false })
  pet!: Pet;

  @ManyToOne(() => Service, { nullable: false })
  service!: Service;

  @ManyToOne(() => Schedule, { nullable: false })
  schedule!: Schedule;

  @Column({ type: 'date' })
  scheduleDate!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDIENTE,
  })
  status!: ReservationStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  observations?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
