import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class CreateDestinationDto {
  @ApiProperty({ example: 'Goa' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ example: 'Goa' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Panaji' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Sun-kissed beaches, Portuguese heritage, vibrant nightlife, and coastal cuisine.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Comprehensive travel overview of Goa with seasonal guides.' })
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: 4.8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 8000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startingBudget: number;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'November to February' })
  @IsOptional()
  @IsString()
  bestTimeToVisit?: string;

  @ApiPropertyOptional({ example: ['Winter', 'Spring'] })
  @IsOptional()
  @IsArray()
  bestSeasons?: string[];

  @ApiPropertyOptional({ example: ['Beach', 'Nightlife', 'Heritage', 'Culinary'] })
  @IsOptional()
  @IsArray()
  travelTypes?: string[];

  @ApiPropertyOptional({ example: '4-6 days' })
  @IsOptional()
  @IsString()
  suggestedDuration?: string;

  @ApiPropertyOptional({
    example: { averageTemp: '28°C', condition: 'Sunny & Pleasant', humidity: '65%' },
  })
  @IsOptional()
  weatherInfo?: {
    averageTemp: string;
    condition: string;
    humidity: string;
    rainyDaysPerMonth?: number;
  };

  @ApiPropertyOptional({ example: ['Calangute Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls'] })
  @IsOptional()
  @IsArray()
  popularAttractions?: string[];

  @ApiPropertyOptional({ example: ['Taj Fort Aguada', 'W Goa', 'Alila Diwa'] })
  @IsOptional()
  @IsArray()
  recommendedHotels?: string[];

  @ApiPropertyOptional({ example: ['Gunpowder', 'Fishermans Wharf', 'Thalassa'] })
  @IsOptional()
  @IsArray()
  recommendedRestaurants?: string[];

  @ApiPropertyOptional({ example: 'Scooter rentals, prepaid taxis, and auto rickshaws are widely available.' })
  @IsOptional()
  @IsString()
  transportationInfo?: string;

  @ApiPropertyOptional({ example: 'Keep emergency numbers saved. Swim only in designated lifeguard zones.' })
  @IsOptional()
  @IsString()
  safetyTips?: string;

  @ApiPropertyOptional({ example: 'Rent a scooter to explore hidden southern beaches like Butterfly Beach.' })
  @IsOptional()
  @IsString()
  localTips?: string;

  @ApiPropertyOptional({ example: 15.2993 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 74.1240 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isTrending?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class FilterDestinationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by state or region' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Max budget filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxBudget?: number;

  @ApiPropertyOptional({ description: 'Min budget filter' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minBudget?: number;

  @ApiPropertyOptional({ description: 'Travel type filter (e.g. Beach, Adventure, Romantic)' })
  @IsOptional()
  @IsString()
  travelType?: string;

  @ApiPropertyOptional({ description: 'Season filter (e.g. Winter, Summer, Monsoon)' })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiPropertyOptional({ description: 'Minimum rating (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ description: 'Only trending destinations' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  trendingOnly?: boolean;

  @ApiPropertyOptional({ description: 'Only featured destinations' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featuredOnly?: boolean;
}
