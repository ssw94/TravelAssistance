import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { TravelStyle } from '../../common/enums';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Sachin' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  preferredCurrency?: string;

  @ApiPropertyOptional({ enum: TravelStyle, example: TravelStyle.STANDARD })
  @IsOptional()
  @IsEnum(TravelStyle)
  preferredTravelStyle?: TravelStyle;

  @ApiPropertyOptional({ example: ['Goa', 'Kerala', 'Paris'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteDestinations?: string[];

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'Avid traveler and photography enthusiast.' })
  @IsOptional()
  @IsString()
  bio?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPassword@123' })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({ example: 'NewPassword@123' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  newPassword: string;
}
