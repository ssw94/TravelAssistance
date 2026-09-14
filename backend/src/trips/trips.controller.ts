import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto, UpdateTripDto } from './dto/trip.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  async create(@CurrentUser() user: User, @Body() createDto: CreateTripDto) {
    return this.tripsService.create(user, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trips for current user' })
  async findAll(@CurrentUser() user: User) {
    return this.tripsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full trip details with itinerary, bookings, expenses' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tripsService.findOne(user, id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get budget, activity, and booking summary for a trip' })
  async getSummary(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tripsService.getSummary(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip details' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateTripDto,
  ) {
    return this.tripsService.update(user, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trip' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.tripsService.remove(user, id);
  }
}
