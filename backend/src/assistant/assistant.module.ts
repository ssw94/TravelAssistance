import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { SmartPlannerProvider } from './providers/smart-planner.provider';
import { Trip } from '../trips/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [AssistantController],
  providers: [AssistantService, SmartPlannerProvider],
  exports: [AssistantService],
})
export class AssistantModule {}
