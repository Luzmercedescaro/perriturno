import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    this.validateProfileFields(createUserDto);

    const existing = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: UserRole.CLIENTE,
      active: true,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async findProfileById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(id: string, updateUserProfileDto: UpdateUserProfileDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    const forbiddenFields = ['role', 'password', 'active', 'id'];
    const hasForbiddenField = forbiddenFields.some((field) => Object.prototype.hasOwnProperty.call(updateUserProfileDto, field));
    if (hasForbiddenField) {
      throw new BadRequestException('Solo se pueden actualizar los campos name, phone y email del perfil.');
    }

    this.validateProfileFields(updateUserProfileDto);

    const safeUpdates: Partial<Pick<User, 'name' | 'phone' | 'email'>> = {};

    if (updateUserProfileDto.name !== undefined) {
      safeUpdates.name = updateUserProfileDto.name.trim();
    }

    if (updateUserProfileDto.phone !== undefined) {
      safeUpdates.phone = updateUserProfileDto.phone.trim();
    }

    if (updateUserProfileDto.email !== undefined) {
      const trimmedEmail = updateUserProfileDto.email.trim();
      const existing = await this.userRepository.findOneBy({ email: trimmedEmail });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ya existe un usuario con este correo.');
      }
      safeUpdates.email = trimmedEmail;
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...safeUpdates,
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  private validateProfileFields(profile: { name?: string; phone?: string; email?: string }): void {
    const { name, phone, email } = profile;

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName || trimmedName.length < 2) {
        throw new BadRequestException('El nombre debe tener al menos 2 caracteres.');
      }
    }

    if (phone !== undefined) {
      const trimmedPhone = phone.trim();
      if (!/^\+?[0-9\s()-]{6,20}$/.test(trimmedPhone)) {
        throw new BadRequestException('El teléfono no tiene un formato válido.');
      }
    }

    if (email !== undefined) {
      const trimmedEmail = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        throw new BadRequestException('El correo electrónico no tiene un formato válido.');
      }
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest);
  }
}
