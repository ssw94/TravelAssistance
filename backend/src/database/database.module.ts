import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [
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
          ],
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
