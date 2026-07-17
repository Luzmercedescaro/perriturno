import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from './user.entity';

describe('UsersService profile updates', () => {
  let service: UsersService;
  let repository: any;

  beforeEach(() => {
    repository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    service = new UsersService(repository);
  });

  it('updates only safe profile fields for the authenticated user', async () => {
    const existingUser = {
      id: 'user-1',
      name: 'Ana',
      phone: '11111111',
      email: 'ana@mail.com',
      password: 'hash',
      role: UserRole.CLIENTE,
      active: true,
    };

    repository.findOneBy.mockResolvedValueOnce(existingUser).mockResolvedValueOnce(null);
    repository.save.mockResolvedValueOnce({
      ...existingUser,
      name: 'Ana Ruiz',
      phone: '22222222',
      email: 'ana.ruiz@mail.com',
    });

    const result = await service.updateProfile('user-1', {
      name: 'Ana Ruiz',
      phone: '22222222',
      email: 'ana.ruiz@mail.com',
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: 'user-1',
        name: 'Ana Ruiz',
        phone: '22222222',
        email: 'ana.ruiz@mail.com',
      }),
    );
    expect(result).not.toHaveProperty('password');
  });

  it('rejects role changes from profile updates', async () => {
    const existingUser = {
      id: 'user-1',
      name: 'Ana',
      phone: '11111111',
      email: 'ana@mail.com',
      password: 'hash',
      role: UserRole.CLIENTE,
      active: true,
    };

    repository.findOneBy.mockResolvedValueOnce(existingUser);

    await expect(
      service.updateProfile('user-1', {
        role: UserRole.ADMIN,
      } as any),
    ).rejects.toThrow('No está permitido modificar el rol desde el perfil.');
  });

  it('rejects duplicate email changes for another user', async () => {
    const existingUser = {
      id: 'user-1',
      name: 'Ana',
      phone: '11111111',
      email: 'ana@mail.com',
      password: 'hash',
      role: UserRole.CLIENTE,
      active: true,
    };

    repository.findOneBy.mockResolvedValueOnce(existingUser).mockResolvedValueOnce({ id: 'user-2' });

    await expect(
      service.updateProfile('user-1', {
        email: 'other@mail.com',
      }),
    ).rejects.toThrow(ConflictException);
  });
});
