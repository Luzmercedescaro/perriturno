import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    this.validateServicePayload(createServiceDto);

    const service = this.serviceRepository.create({
      ...createServiceDto,
      name: createServiceDto.name.trim(),
      description: createServiceDto.description?.trim(),
      active: true,
    });

    return this.serviceRepository.save(service);
  }

  async findAllActive(): Promise<Service[]> {
    const services = await this.serviceRepository.find();
    return services.filter((service) => service.active === true);
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async findActiveById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service || !service.active) {
      throw new NotFoundException('Servicio no encontrado o inactivo.');
    }

    return service;
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado.');
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findById(id);
    const updatedData = { ...service, ...updateServiceDto };

    this.validateServicePayload(updatedData);

    if (updateServiceDto.name !== undefined) {
      updatedData.name = updateServiceDto.name.trim();
    }

    if (updateServiceDto.description !== undefined) {
      updatedData.description = updateServiceDto.description.trim();
    }

    return this.serviceRepository.save(updatedData);
  }

  async updateStatus(id: string, active: boolean): Promise<Service> {
    const service = await this.findById(id);
    service.active = active;
    return this.serviceRepository.save(service);
  }

  private validateServicePayload(payload: Partial<CreateServiceDto & UpdateServiceDto>): void {
    if (payload.name !== undefined) {
      const trimmedName = payload.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('El nombre del servicio no puede estar vacío.');
      }
    }

    if (payload.durationMinutes !== undefined) {
      if (!Number.isInteger(payload.durationMinutes) || payload.durationMinutes <= 0) {
        throw new BadRequestException('La duración debe ser un número entero mayor a cero.');
      }
    }

    if (payload.price !== undefined) {
      if (typeof payload.price !== 'number' || Number.isNaN(payload.price) || payload.price < 0) {
        throw new BadRequestException('El precio no puede ser negativo.');
      }
    }
  }
}
