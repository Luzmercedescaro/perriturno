import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PetSize, Schedule, ScheduleStatus } from '../schedules/schedule.entity';
import { UserRole } from '../users/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation, ReservationStatus } from './reservation.entity';
import { ReservationsService } from './reservations.service';

describe('ReservationsService', () => {
  let service: ReservationsService;

  let reservationRepository: any;
  let manager: any;
  let txReservationRepository: any;
  let txScheduleRepository: any;

  let petsService: { findOneByOwner: jest.Mock };
  let servicesService: { findActiveById: jest.Mock };
  let usersService: { findById: jest.Mock };

  const createScheduleQueryBuilder = () => ({
    setLock: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  });

  const createCancelReservationQueryBuilder = () => ({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    setLock: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  });

  beforeEach(() => {
    txReservationRepository = {
      find: jest.fn(),
      create: jest.fn((value) => value),
      save: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    txScheduleRepository = {
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    manager = {
      getRepository: jest.fn((entity) => {
        if (entity === Reservation) {
          return txReservationRepository;
        }
        if (entity === Schedule) {
          return txScheduleRepository;
        }
        return null;
      }),
    };

    reservationRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      manager: {
        transaction: jest.fn(async (_isolation: string, callback: (m: any) => Promise<any>) => callback(manager)),
      },
    };

    petsService = {
      findOneByOwner: jest.fn(),
    };

    servicesService = {
      findActiveById: jest.fn(),
    };

    usersService = {
      findById: jest.fn(),
    };

    service = new ReservationsService(
      reservationRepository,
      petsService as any,
      servicesService as any,
      usersService as any,
    );
  });

  const buildBaseDto = (): CreateReservationDto => ({
    petId: 'pet-1',
    serviceId: 'service-1',
    scheduleId: 'schedule-1',
    observations: 'Reserva de prueba',
  });

  const buildBaseClient = () => ({
    id: 'client-1',
    name: 'Cliente Uno',
    email: 'cliente@mail.com',
    phone: '3000000000',
    password: 'hash-secreto',
    role: UserRole.CLIENTE,
    active: true,
  });

  const buildBasePet = (size = 'pequeña') => ({
    id: 'pet-1',
    name: 'Firulais',
    type: 'Perro',
    size,
  });

  const buildBaseService = (name = 'Baño') => ({
    id: 'service-1',
    name,
    active: true,
  });

  const buildBaseSchedule = (overrides: Partial<any> = {}) => ({
    id: 'schedule-1',
    scheduleDate: '2026-07-21',
    startTime: '09:00',
    endTime: '11:00',
    petSize: PetSize.PEQUENA,
    status: ScheduleStatus.DISPONIBLE,
    serviceName: 'Baño',
    active: true,
    ...overrides,
  });

  it('crea una reserva válida con estado PENDIENTE', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    const schedule = buildBaseSchedule();
    scheduleQb.getOne.mockResolvedValue(schedule);

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));

    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);
    txReservationRepository.find.mockResolvedValue([]);
    txReservationRepository.save.mockResolvedValue({ id: 'res-1', status: ReservationStatus.PENDIENTE });
    txScheduleRepository.save.mockResolvedValue({});

    await service.create('client-1', buildBaseDto());

    expect(txReservationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ReservationStatus.PENDIENTE,
        scheduleDate: '2026-07-21',
        startTime: '09:00',
        endTime: '11:00',
      }),
    );
    expect(schedule.status).toBe(ScheduleStatus.OCUPADO);
    expect(txScheduleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'schedule-1',
        status: ScheduleStatus.OCUPADO,
      }),
    );
  });

  it('calcula 2 horas para mascota pequeña', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(buildBaseSchedule({ startTime: '09:00', petSize: PetSize.PEQUENA }));

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));

    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);
    txReservationRepository.find.mockResolvedValue([]);
    txReservationRepository.save.mockResolvedValue({ id: 'res-2', status: ReservationStatus.PENDIENTE });
    txScheduleRepository.save.mockResolvedValue({});

    await service.create('client-1', buildBaseDto());

    expect(txReservationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        startTime: '09:00',
        endTime: '11:00',
      }),
    );
  });

  it('calcula 3 horas para mascota grande', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        startTime: '09:00',
        petSize: PetSize.GRANDE,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('grande'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));

    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);
    txReservationRepository.find.mockResolvedValue([]);
    txReservationRepository.save.mockResolvedValue({ id: 'res-3', status: ReservationStatus.PENDIENTE });
    txScheduleRepository.save.mockResolvedValue({});

    await service.create('client-1', buildBaseDto());

    expect(txReservationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        endTime: '12:00',
      }),
    );
  });

  it('rechaza una reserva programada para un lunes', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        scheduleDate: '2026-07-20',
        startTime: '09:00',
        petSize: PetSize.PEQUENA,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza una reserva que termine después de las 6:00 p. m.', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        scheduleDate: '2026-07-22',
        startTime: '16:30',
        petSize: PetSize.PEQUENA,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza una reserva que cruce el almuerzo de 12:00 m. a 1:30 p. m.', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        scheduleDate: '2026-07-22',
        startTime: '11:30',
        petSize: PetSize.PEQUENA,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza un horario que no esté DISPONIBLE', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        status: ScheduleStatus.OCUPADO,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza cuando el tamaño de la mascota no coincide con el horario', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        petSize: PetSize.GRANDE,
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza cuando el servicio no corresponde al horario', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(
      buildBaseSchedule({
        serviceName: 'Peluquería',
      }),
    );

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('rechaza una reserva que se cruza con otra activa', async () => {
    const scheduleQb = createScheduleQueryBuilder();
    scheduleQb.getOne.mockResolvedValue(buildBaseSchedule({ startTime: '10:00', petSize: PetSize.PEQUENA }));

    usersService.findById.mockResolvedValue(buildBaseClient());
    petsService.findOneByOwner.mockResolvedValue(buildBasePet('pequeña'));
    servicesService.findActiveById.mockResolvedValue(buildBaseService('Baño'));
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);

    txReservationRepository.find.mockResolvedValue([
      {
        id: 'res-activa',
        scheduleDate: '2026-07-21',
        startTime: '09:00',
        endTime: '11:00',
        status: ReservationStatus.PENDIENTE,
      },
    ]);

    await expect(service.create('client-1', buildBaseDto())).rejects.toThrow(BadRequestException);
  });

  it('cancela una reserva propia de un CLIENTE y libera el horario', async () => {
    const cancelQb = createCancelReservationQueryBuilder();
    const scheduleQb = createScheduleQueryBuilder();

    cancelQb.getOne.mockResolvedValue({
      id: 'res-8',
      status: ReservationStatus.PENDIENTE,
      client: { id: 'client-1', password: 'hash' },
      schedule: { id: 'schedule-1' },
    });

    scheduleQb.getOne.mockResolvedValue({
      id: 'schedule-1',
      status: ScheduleStatus.OCUPADO,
    });

    txReservationRepository.createQueryBuilder.mockReturnValue(cancelQb);
    txReservationRepository.save.mockResolvedValue({
      id: 'res-8',
      status: ReservationStatus.CANCELADA,
      client: { id: 'client-1', password: 'hash' },
      schedule: { id: 'schedule-1' },
    });
    txReservationRepository.count.mockResolvedValue(0);
    txScheduleRepository.createQueryBuilder.mockReturnValue(scheduleQb);
    txScheduleRepository.save.mockResolvedValue({ id: 'schedule-1', status: ScheduleStatus.DISPONIBLE });

    const result = await service.cancel('res-8', 'client-1', UserRole.CLIENTE);

    expect(result.status).toBe(ReservationStatus.CANCELADA);
    expect(txScheduleRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ status: ScheduleStatus.DISPONIBLE }),
    );
  });

  it('permite que un ADMIN cancele una reserva', async () => {
    const cancelQb = createCancelReservationQueryBuilder();

    cancelQb.getOne.mockResolvedValue({
      id: 'res-9',
      status: ReservationStatus.PENDIENTE,
      client: { id: 'otro-cliente', password: 'hash' },
      schedule: { id: 'schedule-9' },
    });

    txReservationRepository.createQueryBuilder.mockReturnValue(cancelQb);
    txReservationRepository.save.mockResolvedValue({
      id: 'res-9',
      status: ReservationStatus.CANCELADA,
      client: { id: 'otro-cliente', password: 'hash' },
      schedule: { id: 'schedule-9' },
    });
    txReservationRepository.count.mockResolvedValue(1);

    const result = await service.cancel('res-9', 'admin-1', UserRole.ADMIN);

    expect(result.status).toBe(ReservationStatus.CANCELADA);
  });

  it('rechaza que un CLIENTE cancele una reserva ajena', async () => {
    const cancelQb = createCancelReservationQueryBuilder();

    cancelQb.getOne.mockResolvedValue({
      id: 'res-10',
      status: ReservationStatus.PENDIENTE,
      client: { id: 'owner-1', password: 'hash' },
      schedule: { id: 'schedule-10' },
    });

    txReservationRepository.createQueryBuilder.mockReturnValue(cancelQb);

    await expect(service.cancel('res-10', 'client-2', UserRole.CLIENTE)).rejects.toThrow(ForbiddenException);
  });

  it('rechaza cancelar una reserva ya CANCELADA', async () => {
    const cancelQb = createCancelReservationQueryBuilder();

    cancelQb.getOne.mockResolvedValue({
      id: 'res-11',
      status: ReservationStatus.CANCELADA,
      client: { id: 'client-1', password: 'hash' },
      schedule: { id: 'schedule-11' },
    });

    txReservationRepository.createQueryBuilder.mockReturnValue(cancelQb);

    await expect(service.cancel('res-11', 'client-1', UserRole.CLIENTE)).rejects.toThrow(BadRequestException);
  });

  it('findMine consulta únicamente las reservas del cliente', async () => {
    reservationRepository.find.mockResolvedValue([]);

    await service.findMine('client-77');

    expect(reservationRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { client: { id: 'client-77' } },
      }),
    );
  });

  it('findAll elimina la contraseña del cliente en los resultados', async () => {
    reservationRepository.find.mockResolvedValue([
      {
        id: 'res-13',
        status: ReservationStatus.PENDIENTE,
        client: {
          id: 'client-1',
          name: 'Cliente',
          password: 'hash',
        },
        pet: { id: 'pet-1' },
        service: { id: 'service-1' },
        schedule: { id: 'schedule-1' },
      },
    ]);

    const result = await service.findAll();

    expect(result[0].client).toEqual(
      expect.objectContaining({
        id: 'client-1',
        name: 'Cliente',
      }),
    );
    expect(result[0].client).not.toHaveProperty('password');
  });
});
