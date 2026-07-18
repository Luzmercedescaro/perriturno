import { BadRequestException } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule, ScheduleStatus, PetSize } from './schedule.entity';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
    find: jest.Mock;
    findOneBy: jest.Mock;
  };
let servicesService: {
  findActiveById: jest.Mock;
};
 beforeEach(() => {
  repository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  servicesService = {
    findActiveById: jest.fn(),
  };

  service = new SchedulesService(repository as any, servicesService as any);
});

  it('acepta horarios de martes a domingo', async () => {
    repository.find.mockResolvedValue([]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    const result = await service.create({
      scheduleDate: '2026-07-21',
      startTime: '09:00',
      petSize: 'pequeña',
    });

    expect(result.endTime).toBe('11:00');
  });
it('acepta horarios del domingo', async () => {
  repository.find.mockResolvedValue([]);
  repository.create.mockImplementation((value) => value);
  repository.save.mockImplementation((value) => Promise.resolve(value));

  const result = await service.create({
    scheduleDate: '2026-07-19',
    startTime: '09:00',
    petSize: 'pequeña',
  });

  expect(result.endTime).toBe('11:00');
});
  it('rechaza horarios del lunes', async () => {
    await expect(
      service.create({
        scheduleDate: '2026-07-20',
        startTime: '09:00',
        petSize: 'pequeña',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios antes de las 9:00 a. m.', async () => {
    await expect(
      service.create({
        scheduleDate: '2026-07-21',
        startTime: '08:30',
        petSize: 'pequeña',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios que terminan después de las 6:00 p. m.', async () => {
    await expect(
      service.create({
        scheduleDate: '2026-07-21',
        startTime: '15:30',
        petSize: 'grande',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios que cruzan el almuerzo', async () => {
    await expect(
      service.create({
        scheduleDate: '2026-07-21',
        startTime: '11:30',
        petSize: 'pequeña',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('calcula 2 horas para mascota pequeña', async () => {
    repository.find.mockResolvedValue([]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    const result = await service.create({
      scheduleDate: '2026-07-21',
      startTime: '09:00',
      petSize: 'pequeña',
    });

    expect(result.endTime).toBe('11:00');
  });

  it('calcula 3 horas para mascota grande', async () => {
    repository.find.mockResolvedValue([]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    const result = await service.create({
      scheduleDate: '2026-07-21',
      startTime: '09:00',
      petSize: 'grande',
    });

    expect(result.endTime).toBe('12:00');
  });

  it('rechaza tamaños diferentes de pequeña o grande', async () => {
    await expect(
      service.create({
        scheduleDate: '2026-07-21',
        startTime: '09:00',
        petSize: 'mediana',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rechaza horarios solapados', async () => {
    repository.find.mockResolvedValue([
      {
        id: 'other',
        scheduleDate: '2026-07-21',
        startTime: '09:00',
        endTime: '11:00',
        status: ScheduleStatus.OCUPADO,
        active: true,
      },
    ]);
    repository.create.mockImplementation((value) => value);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    await expect(
      service.create({
        scheduleDate: '2026-07-21',
        startTime: '10:00',
        petSize: 'pequeña',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('bloquea y libera horarios', async () => {
    const schedule = {
      id: '1',
      scheduleDate: '2026-07-21',
      startTime: '09:00',
      endTime: '11:00',
      petSize: PetSize.PEQUENA,
      status: ScheduleStatus.DISPONIBLE,
      active: true,
    } as Schedule;

    repository.findOneBy.mockResolvedValue(schedule);
    repository.save.mockImplementation((value) => Promise.resolve(value));

    const blocked = await service.setStatus('1', ScheduleStatus.BLOQUEADO);
    expect(blocked.status).toBe(ScheduleStatus.BLOQUEADO);

    const released = await service.toggleActive('1', false);
    expect(released.active).toBe(false);
  });
it('rechaza la consulta de disponibilidad sin fecha', async () => {
  await expect(
    service.findAvailability({
      scheduleDate: '',
      serviceId: 'service-1',
      petSize: 'pequena',
    }),
  ).rejects.toThrow(BadRequestException);
});
it('clasifica horarios disponibles, ocupados y bloqueados', async () => {
  servicesService.findActiveById.mockResolvedValue({
    id: 'service-1',
    name: 'Baño',
    active: true,
  });

  repository.find.mockResolvedValue([
    {
      id: 'schedule-1',
      scheduleDate: '2026-07-21',
      startTime: '09:00',
      endTime: '11:00',
      petSize: PetSize.PEQUENA,
      status: ScheduleStatus.DISPONIBLE,
      serviceName: 'Baño',
      active: true,
    },
    {
      id: 'schedule-2',
      scheduleDate: '2026-07-21',
      startTime: '13:30',
      endTime: '15:30',
      petSize: PetSize.PEQUENA,
      status: ScheduleStatus.OCUPADO,
      serviceName: 'Baño',
      active: true,
    },
    {
      id: 'schedule-3',
      scheduleDate: '2026-07-21',
      startTime: '15:30',
      endTime: '17:30',
      petSize: PetSize.PEQUENA,
      status: ScheduleStatus.BLOQUEADO,
      serviceName: 'Baño',
      active: true,
    },
  ]);

  const result = await service.findAvailability({
    scheduleDate: '2026-07-21',
    serviceId: 'service-1',
    petSize: 'pequena',
  });

  expect(result.available).toHaveLength(1);
  expect(result.occupied).toHaveLength(1);
  expect(result.blocked).toHaveLength(1);
  expect(result.message).toBe('Se encontraron horarios disponibles.');
});
});
