import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { BookingType } from '../common/enums';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new travel booking record' })
  async create(@CurrentUser() user: User, @Body() createDto: CreateBookingDto) {
    return this.bookingsService.create(user, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for user' })
  @ApiQuery({ name: 'tripId', required: false })
  @ApiQuery({ name: 'type', enum: BookingType, required: false })
  async findAll(
    @CurrentUser() user: User,
    @Query('tripId') tripId?: string,
    @Query('type') type?: BookingType,
  ) {
    return this.bookingsService.findAll(user, tripId, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single booking record' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bookingsService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking record' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingDto,
  ) {
    return this.bookingsService.update(user, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking record' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bookingsService.remove(user, id);
  }
}
