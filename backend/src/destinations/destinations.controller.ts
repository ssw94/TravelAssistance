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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto, FilterDestinationDto } from './dto/destination.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums';

@ApiTags('Destinations')
@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Discover and filter destinations' })
  async findAll(@Query() filterDto: FilterDestinationDto) {
    return this.destinationsService.findAll(filterDto);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending destinations' })
  async getTrending(@Query('limit') limit?: number) {
    return this.destinationsService.getTrending(limit ? +limit : 6);
  }

  @Public()
  @Get('recommended')
  @ApiOperation({ summary: 'Get recommended destinations' })
  async getRecommended(@Query('limit') limit?: number) {
    return this.destinationsService.getRecommended(limit ? +limit : 6);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('saved/me')
  @ApiOperation({ summary: 'Get all saved wishlist destinations for current user' })
  async getSavedDestinations(@CurrentUser() user: User) {
    return this.destinationsService.getSavedDestinations(user);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get comprehensive details of a single destination' })
  async findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/save')
  @ApiOperation({ summary: 'Bookmark / save destination to user wishlist' })
  async saveDestination(
    @CurrentUser() user: User,
    @Param('id') destinationId: string,
  ) {
    return this.destinationsService.saveDestination(user, destinationId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id/save')
  @ApiOperation({ summary: 'Remove destination from user wishlist' })
  async unsaveDestination(
    @CurrentUser() user: User,
    @Param('id') destinationId: string,
  ) {
    return this.destinationsService.unsaveDestination(user, destinationId);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new destination (Admin only)' })
  async create(@Body() createDto: CreateDestinationDto) {
    return this.destinationsService.create(createDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update destination (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateDestinationDto>,
  ) {
    return this.destinationsService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete destination (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.destinationsService.remove(id);
  }
}
