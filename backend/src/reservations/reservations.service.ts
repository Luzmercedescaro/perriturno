import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pet } from '../pets/pet.entity';
import { PetsService } from '../pets/pets.service';
import { PetSize, Schedule, ScheduleStatus } from '../schedules/schedule.entity';
import { ServicesService } from '../services/services.service';
import { User, UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { QueryAgendaDto } from './dto/query-agenda.dto';
import { Reservation, ReservationStatus } from './reservation.entity';
import { ReservationStatusHistory } from './reservation-status-history.entity';

@Injectable()
export class ReservationsService {
  private readonly openingHour = 9 * 60;
  private readonly closingHour = 18 * 60;
  private readonly lunchStart = 12 * 60;
  private readonly lunchEnd = 13 * 60 + 30;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservationStatusHistory)
    private readonly historyRepository: Repository<ReservationStatusHistory>,
    private readonly petsService: PetsService,
    private readonly servicesService: ServicesService,
    private readonly usersService: UsersService,
  ) {}

  async create(clientId: string, createReservationDto: CreateReservationDto) {
    this.validateRequiredIds(createReservationDto);
    this.validateObservations(createReservationDto.observations);

    const petId = createReservationDto.petId.trim();
    const serviceId = createReservationDto.serviceId.trim();
    const scheduleId = createReservationDto.scheduleId.trim();

    const client = await this.usersService.findById(clientId);
    if (!client || !client.active) {
      throw new NotFoundException('Usuario no encontrado o inactivo.');
    }

    const pet = await this.petsService.findOneByOwner(petId, clientId);
    const service = await this.servicesService.findActiveById(serviceId);

    return this.reservationRepository.manager.transaction('SERIALIZABLE', async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const scheduleRepo = manager.getRepository(Schedule);

      const schedule = await scheduleRepo
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :id', { id: scheduleId })
        .getOne();

      if (!schedule) {
        throw new NotFoundException('Horario no encontrado.');
      }

      if (!schedule.active || schedule.status !== ScheduleStatus.DISPONIBLE) {
        throw new BadRequestException('El horario no está disponible para reservar.');
      }

      const normalizedPetSize = this.normalizePetSize(pet.size);
      if (normalizedPetSize !== schedule.petSize) {
        throw new BadRequestException('El tamaño de la mascota no coincide con el horario seleccionado.');
      }

      const scheduleServiceName = (schedule.serviceName ?? '').trim().toLowerCase();
      const selectedServiceName = service.name.trim().toLowerCase();
      if (!scheduleServiceName || scheduleServiceName !== selectedServiceName) {
        throw new BadRequestException('El servicio no corresponde al horario seleccionado.');
      }

      const startMinutes = this.toMinutes(schedule.startTime);
      if (startMinutes === null) {
        throw new BadRequestException('La hora de inicio del horario seleccionado es inválida.');
      }

      const durationMinutes = this.getDurationMinutes(normalizedPetSize);
      const endMinutes = startMinutes + durationMinutes;
      const endTime = this.fromMinutes(endMinutes);

      this.validateBusinessTimeRules(schedule.scheduleDate, startMinutes, endMinutes);

      const activeReservations = await reservationRepo.find({
        where: {
          scheduleDate: schedule.scheduleDate,
          status: In([ReservationStatus.PENDIENTE, ReservationStatus.CONFIRMADA]),
        },
      });

      const overlaps = activeReservations.some((item) => {
        const itemStart = this.toMinutes(item.startTime);
        const itemEnd = this.toMinutes(item.endTime);
        if (itemStart === null || itemEnd === null) {
          return false;
        }
        return this.hasOverlap(startMinutes, endMinutes, itemStart, itemEnd);
      });

      if (overlaps) {
        throw new BadRequestException('La reserva se cruza con otra reserva activa.');
      }

      const reservation = reservationRepo.create({
        client,
        pet: { id: pet.id } as Pet,
        service,
        schedule,
        scheduleDate: schedule.scheduleDate,
        startTime: schedule.startTime,
        endTime,
        status: ReservationStatus.PENDIENTE,
        observations: createReservationDto.observations?.trim() || undefined,
      });

      const saved = await reservationRepo.save(reservation);

      schedule.status = ScheduleStatus.OCUPADO;
      await scheduleRepo.save(schedule);

      return this.removePasswordFromReservation({
        ...saved,
        client,
        service,
        schedule,
      } as Reservation);
    });
  }

  async findMine(clientId: string) {
    return this.reservationRepository.find({
      where: { client: { id: clientId } },
      relations: {
        pet: true,
        service: true,
        schedule: true,
      },
      order: {
        scheduleDate: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  async findAll() {
    const reservations = await this.reservationRepository.find({
      relations: {
        client: true,
        pet: true,
        service: true,
        schedule: true,
      },
      order: {
        scheduleDate: 'ASC',
        startTime: 'ASC',
      },
    });

    return reservations.map((reservation) => this.removePasswordFromReservation(reservation));
  }
async findAgenda(query: QueryAgendaDto) {
  const where: any = {};

  if (query.scheduleDate?.trim()) {
    where.scheduleDate = query.scheduleDate.trim();
  }

  if (query.status?.trim()) {
    const status = query.status.trim().toUpperCase() as ReservationStatus;

    if (!Object.values(ReservationStatus).includes(status)) {
      throw new BadRequestException(
        'El estado debe ser PENDIENTE, CONFIRMADA, FINALIZADA o CANCELADA.',
      );
    }

    where.status = status;
  }

  if (query.serviceId?.trim()) {
    where.service = { id: query.serviceId.trim() };
  }

  const reservations = await this.reservationRepository.find({
    where,
    relations: {
      client: true,
      pet: true,
      service: true,
      schedule: true,
    },
    order: {
      scheduleDate: 'ASC',
      startTime: 'ASC',
    },
  });

  return reservations.map((reservation) =>
    this.removePasswordFromReservation(reservation),
  );
}
  async findHistory(id: string) {
    const history = await this.historyRepository.find({
      where: { reservation: { id } },
      relations: { changedBy: true },
      order: { changedAt: 'ASC' },
    });

    return history.map((item) => {
      if (!item.changedBy) {
        return item;
      }

      const { password: _password, ...safeChangedBy } = item.changedBy as User;
      return {
        ...item,
        changedBy: safeChangedBy as User,
      };
    });
  }
  async confirm(id: string, actorId: string, actorRole: UserRole) {
  if (actorRole !== UserRole.ADMIN) {
    throw new ForbiddenException('Solo un administrador puede confirmar reservas.');
  }

  return this.reservationRepository.manager.transaction(
    'SERIALIZABLE',
    async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const historyRepo = manager.getRepository(ReservationStatusHistory);

      const reservation = await reservationRepo
        .createQueryBuilder('reservation')
        .innerJoinAndSelect('reservation.client', 'client')
        .innerJoinAndSelect('reservation.schedule', 'schedule')
        .setLock('pessimistic_write')
        .where('reservation.id = :id', { id })
        .getOne();

      if (!reservation) {
        throw new NotFoundException('Reserva no encontrada.');
      }

      if (reservation.status !== ReservationStatus.PENDIENTE) {
        throw new BadRequestException(
          'Solo una reserva PENDIENTE puede ser confirmada.',
        );
      }

      const startMinutes = this.toMinutes(reservation.startTime);
      const endMinutes = this.toMinutes(reservation.endTime);

      if (startMinutes === null || endMinutes === null) {
        throw new BadRequestException('El horario de la reserva es inválido.');
      }

      const activeReservations = await reservationRepo.find({
        where: {
          scheduleDate: reservation.scheduleDate,
          status: In([
            ReservationStatus.PENDIENTE,
            ReservationStatus.CONFIRMADA,
          ]),
        },
      });

      const hasConflict = activeReservations.some((item) => {
        if (item.id === reservation.id) {
          return false;
        }

        const itemStart = this.toMinutes(item.startTime);
        const itemEnd = this.toMinutes(item.endTime);

        if (itemStart === null || itemEnd === null) {
          return false;
        }

        return this.hasOverlap(
          startMinutes,
          endMinutes,
          itemStart,
          itemEnd,
        );
      });

      if (hasConflict) {
        throw new BadRequestException(
          'La reserva se cruza con otra reserva activa.',
        );
      }

      const previousStatus = reservation.status;
      reservation.status = ReservationStatus.CONFIRMADA;

      const saved = await reservationRepo.save(reservation);

      const history = historyRepo.create({
        reservation: saved,
        previousStatus,
        newStatus: ReservationStatus.CONFIRMADA,
        changedBy: { id: actorId } as User,
      });

      await historyRepo.save(history);

      return this.removePasswordFromReservation(saved);
    },
  );
}
  async finalize(id: string, actorId: string, actorRole: UserRole) {
  if (actorRole !== UserRole.ADMIN) {
    throw new ForbiddenException(
      'Solo un administrador puede finalizar reservas.',
    );
  }

  return this.reservationRepository.manager.transaction(
    'SERIALIZABLE',
    async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const historyRepo = manager.getRepository(ReservationStatusHistory);

      const reservation = await reservationRepo
        .createQueryBuilder('reservation')
        .innerJoinAndSelect('reservation.client', 'client')
        .innerJoinAndSelect('reservation.schedule', 'schedule')
        .setLock('pessimistic_write')
        .where('reservation.id = :id', { id })
        .getOne();

      if (!reservation) {
        throw new NotFoundException('Reserva no encontrada.');
      }

      if (reservation.status !== ReservationStatus.CONFIRMADA) {
        throw new BadRequestException(
          'Solo una reserva CONFIRMADA puede ser finalizada.',
        );
      }

      const previousStatus = reservation.status;
      reservation.status = ReservationStatus.FINALIZADA;

      const saved = await reservationRepo.save(reservation);

      const history = historyRepo.create({
        reservation: saved,
        previousStatus,
        newStatus: ReservationStatus.FINALIZADA,
        changedBy: { id: actorId } as User,
      });

      await historyRepo.save(history);

      return this.removePasswordFromReservation(saved);
    },
  );
}
async cancel(id: string, actorId: string, actorRole: UserRole) {
    return this.reservationRepository.manager.transaction('SERIALIZABLE', async (manager) => {
      const reservationRepo = manager.getRepository(Reservation);
      const scheduleRepo = manager.getRepository(Schedule);
      const historyRepo = manager.getRepository(ReservationStatusHistory);
      const reservation = await reservationRepo
        .createQueryBuilder('reservation')
        .innerJoinAndSelect('reservation.client', 'client')
        .innerJoinAndSelect('reservation.schedule', 'schedule')
        .setLock('pessimistic_write')
        .where('reservation.id = :id', { id })
        .getOne();

      if (!reservation) {
        throw new NotFoundException('Reserva no encontrada.');
      }

      if (actorRole === UserRole.CLIENTE && reservation.client.id !== actorId) {
        throw new ForbiddenException('No tienes permiso para cancelar esta reserva.');
      }

      if (actorRole !== UserRole.CLIENTE && actorRole !== UserRole.ADMIN) {
        throw new ForbiddenException('No tienes permiso para cancelar reservas.');
      }

      if (reservation.status === ReservationStatus.CANCELADA) {
        throw new BadRequestException('La reserva ya está cancelada.');
      }
      const previousStatus = reservation.status;
      reservation.status = ReservationStatus.CANCELADA;
      const saved = await reservationRepo.save(reservation);
      const history = historyRepo.create({
        reservation: saved,
        previousStatus,
        newStatus: ReservationStatus.CANCELADA,
        changedBy: { id: actorId } as User,
  });

      await historyRepo.save(history);
      const activeCount = await reservationRepo.count({
        where: {
          schedule: { id: reservation.schedule.id },
          status: In([ReservationStatus.PENDIENTE, ReservationStatus.CONFIRMADA]),
        },
      });

      if (activeCount === 0) {
        const lockedSchedule = await scheduleRepo
          .createQueryBuilder('schedule')
          .setLock('pessimistic_write')
          .where('schedule.id = :id', { id: reservation.schedule.id })
          .getOne();

        if (lockedSchedule) {
          lockedSchedule.status = ScheduleStatus.DISPONIBLE;
          await scheduleRepo.save(lockedSchedule);
        }
      }

      return this.removePasswordFromReservation(saved);
    });
  }

  private validateRequiredIds(createReservationDto: CreateReservationDto): void {
    const { petId, serviceId, scheduleId } = createReservationDto;

    if (!petId?.trim()) {
      throw new BadRequestException('El campo petId es obligatorio.');
    }

    if (!serviceId?.trim()) {
      throw new BadRequestException('El campo serviceId es obligatorio.');
    }

    if (!scheduleId?.trim()) {
      throw new BadRequestException('El campo scheduleId es obligatorio.');
    }
  }

  private validateObservations(observations?: string): void {
    if (observations !== undefined && observations.trim().length > 500) {
      throw new BadRequestException('Las observaciones no pueden superar los 500 caracteres.');
    }
  }

  private normalizePetSize(size: string): PetSize {
    const normalized = size.trim().toLowerCase();

    if (
      normalized === 'pequena' ||
      normalized === 'pequeña' ||
      normalized === 'pequeno' ||
      normalized === 'pequeño'
    ) {
      return PetSize.PEQUENA;
    }

    if (normalized === 'grande') {
      return PetSize.GRANDE;
    }

    throw new BadRequestException('Solo se aceptan tamaños de mascota pequeña o grande.');
  }

  private getDurationMinutes(petSize: PetSize): number {
    if (petSize === PetSize.PEQUENA) {
      return 120;
    }

    return 180;
  }

  private validateBusinessTimeRules(scheduleDate: string, startMinutes: number, endMinutes: number): void {
    const day = this.getWeekday(scheduleDate);
    if (day === 1) {
      throw new BadRequestException('La atención solo está permitida de martes a domingo.');
    }

    if (startMinutes < this.openingHour) {
      throw new BadRequestException('La hora de inicio no puede ser anterior a las 9:00 a. m.');
    }

    if (endMinutes > this.closingHour) {
      throw new BadRequestException('La reserva termina después de las 6:00 p. m.');
    }

    if (this.crossesLunch(startMinutes, endMinutes)) {
      throw new BadRequestException('La reserva cruza el bloque de almuerzo de 12:00 m. a 1:30 p. m.');
    }
  }

  private hasOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
    return startA < endB && endA > startB;
  }

  private crossesLunch(startMinutes: number, endMinutes: number): boolean {
    return startMinutes < this.lunchEnd && endMinutes > this.lunchStart;
  }

  private toMinutes(value: string): number | null {
    if (!value) {
      return null;
    }

    const [hoursRaw, minutesRaw] = value.split(':');
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return hours * 60 + minutes;
  }

  private fromMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');
    const mins = (minutes % 60).toString().padStart(2, '0');
    return `${hours}:${mins}`;
  }

  private getWeekday(date: string): number {
    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCDay();
  }

  private removePasswordFromReservation(reservation: Reservation) {
    if (!reservation.client) {
      return reservation;
    }

    const { password: _password, ...safeClient } = reservation.client as User;
    return {
      ...reservation,
      client: safeClient,
    };
  }
}
