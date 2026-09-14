import { Module, Logger } from '@nestjs/common';
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
        const logger = new Logger('DatabaseModule');

        const entities = [
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
        ];

        const baseConfig: any = {
          type: 'postgres',
          entities,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
        };

        if (dbConfig.ssl) {
          baseConfig.ssl = {
            rejectUnauthorized: false,
          };
        }

        if (dbConfig.url) {
          logger.log(`🔗 Connecting to PostgreSQL using DATABASE_URL (SSL: ${!!dbConfig.ssl})`);
          return {
            ...baseConfig,
            url: dbConfig.url,
          };
        }

        logger.log(
          `🔗 Connecting to PostgreSQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database} (SSL: ${!!dbConfig.ssl})`,
        );

        return {
          ...baseConfig,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
