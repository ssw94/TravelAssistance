import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReviewStatus } from '../../common/enums';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Unforgettable experience in South Goa!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'The beaches were pristine, sunset cruises were breathtaking, and local fish curry was unmatched.',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiPropertyOptional({ example: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class ModerateReviewDto {
  @ApiProperty({ enum: ReviewStatus, example: ReviewStatus.APPROVED })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
