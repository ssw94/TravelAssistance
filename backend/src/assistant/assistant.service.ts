import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SmartPlannerProvider } from './providers/smart-planner.provider';
import { ILlmProvider, AssistantContext, AssistantResponse } from './interfaces/llm-provider.interface';
import { ChatMessageDto } from './dto/chat.dto';
import { User } from '../users/entities/user.entity';
import { Trip } from '../trips/entities/trip.entity';

@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);
  private provider: ILlmProvider;

  constructor(
    private readonly configService: ConfigService,
    private readonly smartPlannerProvider: SmartPlannerProvider,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {
    // Modular provider initialization: can be configured to use Gemini, OpenAI, or SmartPlanner
    this.provider = this.smartPlannerProvider;
  }

  async processChat(user: User | null, dto: ChatMessageDto): Promise<AssistantResponse> {
    const context: AssistantContext = {
      userId: user?.id,
      userPreferredCurrency: user?.profile?.preferredCurrency || 'INR',
      userTravelStyle: user?.profile?.preferredTravelStyle || 'STANDARD',
      activeTrips: [],
    };

    if (user) {
      const activeTrips = await this.tripRepository.find({
        where: { user: { id: user.id } },
        take: 3,
        order: { startDate: 'ASC' },
      });
      context.activeTrips = activeTrips.map((t) => ({
        id: t.id,
        name: t.name,
        destination: t.destination,
        startDate: t.startDate,
        endDate: t.endDate,
      }));
    }

    const history = dto.history || [];
    return this.provider.generateResponse(dto.message, history, context);
  }
}
