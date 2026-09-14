import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingType, BookingStatus } from '../../common/enums';

export class CreateBookingDto {
  @ApiProperty({ enum: BookingType, example: BookingType.HOTEL })
  @IsEnum(BookingType)
  bookingType: BookingType;

  @ApiProperty({ example: 'Taj Exotica Resort & Spa' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Taj Hotels / Booking.com' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiPropertyOptional({ example: 'TAJ-GOA-98214' })
  @IsOptional()
  @IsString()
  confirmationNumber?: string;

  @ApiProperty({ example: '2026-10-12T14:00:00Z' })
  @IsDateString()
  startDateTime: string;

  @ApiPropertyOptional({ example: '2026-10-17T11:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDateTime?: string;

  @ApiProperty({ example: 28000, default: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: BookingStatus, default: BookingStatus.CONFIRMED })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ example: 'Luxury Sea View Villa with complimentary breakfast.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Trip ID to associate with this booking' })
  @IsOptional()
  @IsString()
  tripId?: string;

  @ApiPropertyOptional({
    example: { roomType: 'Sea View Suite', contactPhone: '+918326683333' },
  })
  @IsOptional()
  details?: Record<string, any>;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ enum: BookingType })
  @IsOptional()
  @IsEnum(BookingType)
  bookingType?: BookingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  confirmationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDateTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDateTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tripId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  details?: Record<string, any>;
}
