import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';
import { ItineraryDay } from './entities/itinerary-day.entity';
import { ItineraryItem } from './entities/itinerary-item.entity';
import { Trip } from '../trips/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItineraryDay, ItineraryItem, Trip])],
  controllers: [ItinerariesController],
  providers: [ItinerariesService],
  exports: [ItinerariesService, TypeOrmModule],
})
export class ItinerariesModule {}
