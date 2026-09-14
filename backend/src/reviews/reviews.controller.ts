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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, ModerateReviewDto } from './dto/review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('destinations/:destinationId/reviews')
  @ApiOperation({ summary: 'Get all approved reviews for a destination' })
  async findByDestination(@Param('destinationId') destinationId: string) {
    return this.reviewsService.findByDestination(destinationId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('destinations/:destinationId/reviews')
  @ApiOperation({ summary: 'Submit a new review for a destination' })
  async create(
    @CurrentUser() user: User,
    @Param('destinationId') destinationId: string,
    @Body() createDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user, destinationId, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a review' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.reviewsService.remove(user, id);
  }

  // Admin Moderation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Get('admin/reviews')
  @ApiOperation({ summary: 'Get all reviews for moderation (Admin only)' })
  async findAllForAdmin() {
    return this.reviewsService.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @Patch('admin/reviews/:id/moderate')
  @ApiOperation({ summary: 'Approve or reject a review (Admin only)' })
  async moderate(
    @Param('id') id: string,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.reviewsService.moderate(id, dto.status);
  }
}
