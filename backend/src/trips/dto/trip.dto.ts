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
import { TravelStyle, TripStatus } from '../../common/enums';

export class CreateTripDto {
  @ApiProperty({ example: 'Exciting Goa Beach Vacation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Goa, India' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ description: 'Destination entity ID if chosen from catalog' })
  @IsOptional()
  @IsString()
  destinationId?: string;

  @ApiProperty({ example: '2026-10-12' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-10-17' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 2, default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfTravelers: number;

  @ApiPropertyOptional({ enum: TravelStyle, default: TravelStyle.STANDARD })
  @IsOptional()
  @IsEnum(TravelStyle)
  travelStyle?: TravelStyle;

  @ApiPropertyOptional({ enum: TripStatus, default: TripStatus.PLANNING })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiPropertyOptional({ example: 45000, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'Focus on beach shacks, seafood, and historic churches.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2' })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}

export class UpdateTripDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numberOfTravelers?: number;

  @ApiPropertyOptional({ enum: TravelStyle })
  @IsOptional()
  @IsEnum(TravelStyle)
  travelStyle?: TravelStyle;

  @ApiPropertyOptional({ enum: TripStatus })
  @IsOptional()
  @IsEnum(TripStatus)
  status?: TripStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}
