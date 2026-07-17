import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPetDto: CreatePetDto, userId: string): Promise<Omit<Pet, 'owner'>> {
    this.validatePetFields(createPetDto);

    const owner = await this.userRepository.findOneBy({ id: userId });
    if (!owner || !owner.active) {
      throw new NotFoundException('Usuario no encontrado o inactivo.');
    }

    const pet = this.petRepository.create({
      ...createPetDto,
      owner,
    });

    const savedPet = await this.petRepository.save(pet);
    const { owner: _owner, ...result } = savedPet;
    return result;
  }

  async findAllByOwner(userId: string): Promise<Omit<Pet, 'owner'>[]> {
    const pets = await this.petRepository.find({
      where: { owner: { id: userId } },
      relations: { owner: true },
    });

    return pets.map(({ owner, ...pet }) => pet);
  }

  async findOneByOwner(id: string, userId: string): Promise<Omit<Pet, 'owner'>> {
    const pet = await this.petRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: { owner: true },
    });

    if (!pet) {
      throw new NotFoundException('Mascota no encontrada.');
    }

    const { owner, ...result } = pet;
    return result;
  }

  async update(id: string, userId: string, updatePetDto: UpdatePetDto): Promise<Omit<Pet, 'owner'>> {
    const pet = await this.petRepository.findOne({
      where: { id, owner: { id: userId } },
      relations: { owner: true },
    });

    if (!pet) {
      throw new NotFoundException('Mascota no encontrada.');
    }

    this.validatePetFields(updatePetDto, true);

    const updatedPet = await this.petRepository.save({
      ...pet,
      ...updatePetDto,
    });

    const { owner, ...result } = updatedPet;
    return result;
  }

  private validatePetFields(pet: Partial<CreatePetDto & UpdatePetDto>, partial = false): void {
    const fields = ['name', 'type', 'size'] as const;

    for (const field of fields) {
      const value = pet[field];
      if (!partial && (value === undefined || String(value).trim() === '')) {
        throw new BadRequestException(`El campo ${field} es obligatorio.`);
      }

      if (value !== undefined && String(value).trim() === '') {
        throw new BadRequestException(`El campo ${field} no puede estar vacío.`);
      }
    }

    if (pet.name !== undefined) {
      const trimmedName = pet.name.trim();
      if (trimmedName.length < 2) {
        throw new BadRequestException('El nombre debe tener al menos 2 caracteres.');
      }
    }

    if (pet.type !== undefined) {
      const trimmedType = pet.type.trim();
      if (trimmedType.length < 2) {
        throw new BadRequestException('El tipo debe tener al menos 2 caracteres.');
      }
    }

    if (pet.size !== undefined) {
      const trimmedSize = pet.size.trim();
      if (trimmedSize.length < 2) {
        throw new BadRequestException('El tamaño debe tener al menos 2 caracteres.');
      }
    }

    if (pet.observations !== undefined && pet.observations.trim().length > 500) {
      throw new BadRequestException('Las observaciones no pueden superar los 500 caracteres.');
    }
  }
}
