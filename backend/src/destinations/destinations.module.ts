import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { Destination } from './entities/destination.entity';
import { DestinationImage } from './entities/destination-image.entity';
import { DestinationActivity } from './entities/destination-activity.entity';
import { SavedDestination } from './entities/saved-destination.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Destination,
      DestinationImage,
      DestinationActivity,
      SavedDestination,
    ]),
  ],
  controllers: [DestinationsController],
  providers: [DestinationsService],
  exports: [DestinationsService, TypeOrmModule],
})
export class DestinationsModule {}
