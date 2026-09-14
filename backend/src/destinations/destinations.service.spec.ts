import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import { DestinationImage } from './entities/destination-image.entity';
import { DestinationActivity } from './entities/destination-activity.entity';
import { SavedDestination } from './entities/saved-destination.entity';

describe('DestinationsService', () => {
  let service: DestinationsService;
  let destRepo: any;

  const mockDestination = {
    id: 'dest-1',
    name: 'Goa',
    country: 'India',
    rating: 4.8,
    reviewCount: 50,
    startingBudget: 12000,
    isTrending: true,
  };

  beforeEach(async () => {
    destRepo = {
      find: jest.fn().mockResolvedValue([mockDestination]),
      findOne: jest.fn().mockResolvedValue(mockDestination),
      create: jest.fn().mockImplementation((d) => d),
      save: jest.fn().mockImplementation((d) => Promise.resolve({ id: 'saved-id', ...d })),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockDestination], 1]),
        getOne: jest.fn().mockResolvedValue(mockDestination),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DestinationsService,
        { provide: getRepositoryToken(Destination), useValue: destRepo },
        { provide: getRepositoryToken(DestinationImage), useValue: {} },
        { provide: getRepositoryToken(DestinationActivity), useValue: {} },
        { provide: getRepositoryToken(SavedDestination), useValue: {} },
      ],
    }).compile();

    service = module.get<DestinationsService>(DestinationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return paginated destinations', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('should return trending destinations', async () => {
    const result = await service.getTrending();
    expect(result).toHaveLength(1);
    expect(destRepo.find).toHaveBeenCalledWith({
      where: { isTrending: true },
      take: 6,
      order: { rating: 'DESC' },
    });
  });
});
