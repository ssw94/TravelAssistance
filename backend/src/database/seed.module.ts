import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import configuration from '../config/configuration';
import { DatabaseModule } from './database.module';
import { SeedService } from './seed.service';

import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { Destination } from '../destinations/entities/destination.entity';
import { DestinationImage } from '../destinations/entities/destination-image.entity';
import { DestinationActivity } from '../destinations/entities/destination-activity.entity';
import { SavedDestination } from '../destinations/entities/saved-destination.entity';
import { Trip } from '../trips/entities/trip.entity';
import { TripMember } from '../trips/entities/trip-member.entity';
import { ItineraryDay } from '../itineraries/entities/itinerary-day.entity';
import { ItineraryItem } from '../itineraries/entities/itinerary-item.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Review } from '../reviews/entities/review.entity';
import { Notification } from '../notifications/entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      UserProfile,
      RefreshToken,
      Destination,
      DestinationImage,
      DestinationActivity,
      SavedDestination,
      Trip,
      TripMember,
      ItineraryDay,
      ItineraryItem,
      Booking,
      Expense,
      Review,
      Notification,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
