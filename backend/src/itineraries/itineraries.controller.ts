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
import { ItinerariesService } from './itineraries.service';
import {
  CreateItineraryDayDto,
  CreateItineraryItemDto,
  UpdateItineraryItemDto,
  ReorderItemsDto,
} from './dto/itinerary.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@ApiTags('Itineraries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ItinerariesController {
  constructor(private readonly itinerariesService: ItinerariesService) {}

  @Get('trips/:tripId/itinerary')
  @ApiOperation({ summary: 'Get full day-by-day itinerary with items for a trip' })
  async getTripItinerary(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
  ) {
    return this.itinerariesService.getTripItinerary(user, tripId);
  }

  @Post('trips/:tripId/itinerary/days')
  @ApiOperation({ summary: 'Add a new day to trip itinerary' })
  async addDay(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
    @Body() createDayDto: CreateItineraryDayDto,
  ) {
    return this.itinerariesService.addDay(user, tripId, createDayDto);
  }

  @Delete('itinerary/days/:dayId')
  @ApiOperation({ summary: 'Delete an itinerary day' })
  async removeDay(
    @CurrentUser() user: User,
    @Param('dayId') dayId: string,
  ) {
    return this.itinerariesService.removeDay(user, dayId);
  }

  @Post('itinerary/days/:dayId/items')
  @ApiOperation({ summary: 'Add an activity item to an itinerary day' })
  async addItem(
    @CurrentUser() user: User,
    @Param('dayId') dayId: string,
    @Body() createItemDto: CreateItineraryItemDto,
  ) {
    return this.itinerariesService.addItem(user, dayId, createItemDto);
  }

  @Patch('itinerary/items/:itemId')
  @ApiOperation({ summary: 'Update an itinerary activity item' })
  async updateItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItineraryItemDto,
  ) {
    return this.itinerariesService.updateItem(user, itemId, updateItemDto);
  }

  @Patch('itinerary/items/:itemId/toggle-complete')
  @ApiOperation({ summary: 'Toggle completion status of an activity item' })
  async toggleComplete(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
  ) {
    return this.itinerariesService.toggleComplete(user, itemId);
  }

  @Delete('itinerary/items/:itemId')
  @ApiOperation({ summary: 'Delete an itinerary activity item' })
  async deleteItem(
    @CurrentUser() user: User,
    @Param('itemId') itemId: string,
  ) {
    return this.itinerariesService.deleteItem(user, itemId);
  }

  @Patch('itinerary/days/:dayId/reorder')
  @ApiOperation({ summary: 'Reorder activity items in an itinerary day' })
  async reorderItems(
    @CurrentUser() user: User,
    @Param('dayId') dayId: string,
    @Body() reorderDto: ReorderItemsDto,
  ) {
    return this.itinerariesService.reorderItems(user, dayId, reorderDto);
  }
}
