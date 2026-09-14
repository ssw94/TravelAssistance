import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({ example: 'Plan a 5-day Goa trip under ₹30,000 for 2 people.' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    example: [
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello! Where would you like to explore today?' },
    ],
  })
  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
}
