import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ServicesService } from './services.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOneBy: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };
    service = new ServicesService(repository as any);
  });

  it('debe rechazar un precio negativo al crear un servicio', async () => {
    await expect(
      service.create({
        name: 'Baño',
        description: 'Servicio de baño',
        durationMinutes: 30,
        price: -10,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debe devolver solo los servicios activos para clientes', async () => {
    repository.find.mockResolvedValue([
      { id: '1', name: 'Baño', active: true },
      { id: '2', name: 'Peluquería', active: false },
    ]);

    const result = await service.findAllActive();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Baño');
  });

  it('debe lanzar error cuando un cliente consulta un servicio inactivo', async () => {
    repository.findOneBy.mockResolvedValue({ id: '2', name: 'Peluquería', active: false });

    await expect(service.findActiveById('2')).rejects.toThrow(NotFoundException);
  });
});
