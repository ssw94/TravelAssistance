import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './entities/trip.entity';
import { TripMember } from './entities/trip-member.entity';
import { ItineraryDay } from '../itineraries/entities/itinerary-day.entity';
import { Destination } from '../destinations/entities/destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Trip,
      TripMember,
      ItineraryDay,
      Destination,
    ]),
  ],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService, TypeOrmModule],
})
export class TripsModule {}
