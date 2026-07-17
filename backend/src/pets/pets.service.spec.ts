import { PetsService } from './pets.service';

describe('PetsService', () => {
  let service: PetsService;
  let petRepository: any;
  let userRepository: any;

  beforeEach(() => {
    petRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };
    userRepository = {
      findOneBy: jest.fn(),
    };
    service = new PetsService(petRepository, userRepository);
  });

  it('creates a pet associated to the authenticated user and omits owner data', async () => {
    const userId = 'user-1';
    userRepository.findOneBy.mockResolvedValue({ id: userId, active: true });

    const createdPet = {
      id: 'pet-1',
      name: 'Firulais',
      type: 'Perro',
      size: 'Mediano',
      observations: 'Amigable',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    petRepository.create.mockReturnValue(createdPet);
    petRepository.save.mockResolvedValue(createdPet);

    const result = await service.create(
      {
        name: 'Firulais',
        type: 'Perro',
        size: 'Mediano',
        observations: 'Amigable',
      },
      userId,
    );

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    expect(petRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Firulais',
        owner: { id: userId },
      }),
    );
    expect(result).toEqual(expect.objectContaining({ id: 'pet-1', name: 'Firulais' }));
    expect(result).not.toHaveProperty('owner');
  });
});
