import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AssistantService } from './assistant.service';
import { SmartPlannerProvider } from './providers/smart-planner.provider';
import { Trip } from '../trips/entities/trip.entity';

describe('AssistantService', () => {
  let service: AssistantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        SmartPlannerProvider,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('smart-engine') },
        },
        {
          provide: getRepositoryToken(Trip),
          useValue: { find: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a 5-day Goa trip itinerary with budget estimation', async () => {
    const res = await service.processChat(null, {
      message: 'Plan a 5-day Goa trip under ₹30,000',
    });

    expect(res).toBeDefined();
    expect(res.reply).toContain('Goa');
    expect(res.planSuggestion).toBeDefined();
    expect(res.planSuggestion?.durationDays).toBe(5);
    expect(res.planSuggestion?.dayByDayPlan).toHaveLength(5);
  });
});
