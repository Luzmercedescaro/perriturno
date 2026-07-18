import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule, ScheduleStatus, PetSize } from './schedule.entity';

@Injectable()
export class SchedulesService {
  private readonly openingHour = 9 * 60;
  private readonly closingHour = 18 * 60;
  private readonly lunchStart = 12 * 60;
  private readonly lunchEnd = 13 * 60 + 30;

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const validated = this.validateAndBuild(createScheduleDto);
    const existingOverlap = await this.hasOverlap(validated.startTime, validated.endTime, validated.scheduleDate);
    if (existingOverlap) {
      throw new BadRequestException('El horario se solapa con otro ocupado o bloqueado.');
    }

    const schedule = this.scheduleRepository.create(validated);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ order: { scheduleDate: 'ASC', startTime: 'ASC' } });
  }

  async findById(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneBy({ id });
    if (!schedule) {
      throw new NotFoundException('Horario no encontrado.');
    }
    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findById(id);
    const updatedData = { ...schedule, ...updateScheduleDto };
    const validated = this.validateAndBuild(updatedData);
    const existingOverlap = await this.hasOverlap(validated.startTime, validated.endTime, validated.scheduleDate, id);
    if (existingOverlap) {
      throw new BadRequestException('El horario se solapa con otro ocupado o bloqueado.');
    }

    return this.scheduleRepository.save({ ...schedule, ...validated });
  }

  async setStatus(id: string, status: ScheduleStatus): Promise<Schedule> {
    const schedule = await this.findById(id);
    schedule.status = status;
    return this.scheduleRepository.save(schedule);
  }

  async toggleActive(id: string, active: boolean): Promise<Schedule> {
    const schedule = await this.findById(id);
    schedule.active = active;
    return this.scheduleRepository.save(schedule);
  }

  private validateAndBuild(input: Partial<CreateScheduleDto & UpdateScheduleDto>): {
    scheduleDate: string;
    startTime: string;
    endTime: string;
    petSize: PetSize;
    status: ScheduleStatus;
    serviceName?: string;
    active: boolean;
  } {
    const scheduleDate = input.scheduleDate ?? '';
    const startTime = input.startTime ?? '';
    const petSizeValue = (input.petSize ?? '').toLowerCase().trim();
    const normalizedPetSize = this.normalizePetSize(petSizeValue);

    const startMinutes = this.toMinutes(startTime);
    if (startMinutes === null) {
      throw new BadRequestException('La hora de inicio debe tener formato HH:mm.');
    }

    const day = this.getWeekday(scheduleDate);
    if (day === 0 || day === 1) {
      throw new BadRequestException('La atención solo está permitida de martes a domingo.');
    }

    if (startMinutes < this.openingHour) {
      throw new BadRequestException('La hora de inicio no puede ser anterior a las 9:00 a. m.');
    }

    const durationMinutes = this.getDurationMinutes(normalizedPetSize);
    const endMinutes = startMinutes + durationMinutes;
    if (endMinutes > this.closingHour) {
      throw new BadRequestException('El horario termina después de las 6:00 p. m.');
    }

    if (this.crossesLunch(startMinutes, endMinutes)) {
      throw new BadRequestException('El horario cruza el bloque de almuerzo de 12:00 m. a 1:30 p. m.');
    }

    const normalizedStatus = this.normalizeStatus(input.status);
    return {
      scheduleDate,
      startTime,
      endTime: this.fromMinutes(endMinutes),
      petSize: normalizedPetSize,
      status: normalizedStatus,
      serviceName: input.serviceName?.trim() || undefined,
      active: input.active ?? true,
    };
  }

  private normalizePetSize(value: string): PetSize {
    if (value === 'pequena' || value === 'pequeña' || value === 'pequeno' || value === 'pequeño') {
      return PetSize.PEQUENA;
    }

    if (value === 'grande') {
      return PetSize.GRANDE;
    }

    throw new BadRequestException('Solo se aceptan tamaños de mascota pequeña o grande.');
  }

  private getDurationMinutes(petSize: PetSize): number {
    switch (petSize) {
      case PetSize.PEQUENA:
        return 120;
      case PetSize.GRANDE:
        return 180;
      default:
        throw new BadRequestException('Solo se aceptan tamaños de mascota pequeña o grande.');
    }
  }

  private normalizeStatus(status?: string): ScheduleStatus {
    if (!status) {
      return ScheduleStatus.DISPONIBLE;
    }

    const normalized = status.toUpperCase().trim();
    if (normalized === 'DISPONIBLE') {
      return ScheduleStatus.DISPONIBLE;
    }
    if (normalized === 'OCUPADO') {
      return ScheduleStatus.OCUPADO;
    }
    if (normalized === 'BLOQUEADO') {
      return ScheduleStatus.BLOQUEADO;
    }
    throw new BadRequestException('El estado debe ser DISPONIBLE, OCUPADO o BLOQUEADO.');
  }

  private async hasOverlap(startTime: string, endTime: string, scheduleDate: string, ignoreId?: string): Promise<boolean> {
    const startMinutes = this.toMinutes(startTime);
    const endMinutes = this.toMinutes(endTime);
    if (startMinutes === null || endMinutes === null) {
      return false;
    }

    const existing = await this.scheduleRepository.find({
      where: { scheduleDate, active: true },
    });

    return existing.some((item) => {
      if (item.id === ignoreId) {
        return false;
      }
      if (item.status === ScheduleStatus.DISPONIBLE) {
        return false;
      }
      const itemStart = this.toMinutes(item.startTime);
      const itemEnd = this.toMinutes(item.endTime);
      if (itemStart === null || itemEnd === null) {
        return false;
      }
      return startMinutes < itemEnd && endMinutes > itemStart;
    });
  }

  private crossesLunch(startMinutes: number, endMinutes: number): boolean {
    return startMinutes < this.lunchEnd && endMinutes > this.lunchStart;
  }

  private toMinutes(value: string): number | null {
    if (!value) {
      return null;
    }
    const [hours, minutes] = value.split(':').map(Number);
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
}
