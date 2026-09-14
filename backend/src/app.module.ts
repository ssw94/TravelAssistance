import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DestinationsModule } from './destinations/destinations.module';
import { TripsModule } from './trips/trips.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { BookingsModule } from './bookings/bookings.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AssistantModule } from './assistant/assistant.module';
import { AdminModule } from './admin/admin.module';
import { SeedModule } from './database/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    DestinationsModule,
    TripsModule,
    ItinerariesModule,
    BookingsModule,
    ExpensesModule,
    ReviewsModule,
    NotificationsModule,
    AssistantModule,
    AdminModule,
    SeedModule,
  ],
})
export class AppModule {}
