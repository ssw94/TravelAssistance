import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType } from '../../common/enums';

export class CreateItineraryDayDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  dayNumber: number;

  @ApiProperty({ example: '2026-10-12' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiPropertyOptional({ example: 'Day 1 - Arrival & Beach Relaxation' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Arrive at hotel, relax, explore beach shacks' })
  @IsOptional()
  @IsString()
  summary?: string;
}

export class CreateItineraryItemDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ example: '11:00' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ example: 'Scuba Diving at Grand Island' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'PADI certified guided dive with underwater photography.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ActivityType, default: ActivityType.ACTIVITY })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiPropertyOptional({ example: 'Grand Island, South Goa' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Boat Transfer from jetty' })
  @IsOptional()
  @IsString()
  transportation?: string;

  @ApiPropertyOptional({ example: 3500, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'Bring swimwear and sunscreen' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateItineraryItemDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ActivityType })
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transportation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  orderIndex?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReorderItemDto {
  @ApiProperty({ example: 'item-uuid' })
  @IsString()
  id: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  orderIndex: number;
}

export class ReorderItemsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
