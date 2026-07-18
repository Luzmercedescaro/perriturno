import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ScheduleStatus {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  BLOQUEADO = 'BLOQUEADO',
}

export enum PetSize {
  PEQUENA = 'pequena',
  GRANDE = 'grande',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  scheduleDate!: string;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({ type: 'varchar', length: 20 })
  petSize!: PetSize;

  @Column({ type: 'varchar', length: 20, default: ScheduleStatus.DISPONIBLE })
  status!: ScheduleStatus;

  @Column({ length: 200, nullable: true })
  serviceName?: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
