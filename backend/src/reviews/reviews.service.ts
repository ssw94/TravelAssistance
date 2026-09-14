import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Review } from './entities/review.entity';
import { Destination } from '../destinations/entities/destination.entity';
import { User } from '../users/entities/user.entity';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewStatus, UserRole } from '../common/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(user: User, destinationId: string, dto: CreateReviewDto): Promise<Review> {
    const destination = await this.destinationRepository.findOne({
      where: { id: destinationId },
    });
    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    const existing = await this.reviewRepository.findOne({
      where: { user: { id: user.id }, destination: { id: destinationId } },
    });
    if (existing) {
      throw new BadRequestException('You have already submitted a review for this destination. You can update your existing review.');
    }

    const review = this.reviewRepository.create({
      ...dto,
      user,
      destination,
      status: ReviewStatus.APPROVED,
    });

    const savedReview = await this.reviewRepository.save(review);
    await this.updateDestinationRating(destinationId);

    return savedReview;
  }

  async findByDestination(destinationId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: {
        destination: { id: destinationId },
        status: ReviewStatus.APPROVED,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllForAdmin(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'destination'],
      order: { createdAt: 'DESC' },
    });
  }

  async moderate(id: string, status: ReviewStatus): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['destination'],
    });
    if (!review) throw new NotFoundException('Review not found');

    review.status = status;
    const updated = await this.reviewRepository.save(review);

    if (review.destination) {
      await this.updateDestinationRating(review.destination.id);
    }

    return updated;
  }

  async remove(user: User, id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'destination'],
    });
    if (!review) throw new NotFoundException('Review not found');

    if (user.role !== UserRole.ADMIN && review.user.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const destinationId = review.destination?.id;
    await this.reviewRepository.remove(review);

    if (destinationId) {
      await this.updateDestinationRating(destinationId);
    }

    return { success: true, message: 'Review deleted successfully' };
  }

  private async updateDestinationRating(destinationId: string) {
    const reviews = await this.reviewRepository.find({
      where: {
        destination: { id: destinationId },
        status: ReviewStatus.APPROVED,
      },
    });

    const count = reviews.length;
    const avg = count > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
      : 4.5;

    await this.destinationRepository.update(destinationId, {
      rating: parseFloat(avg.toFixed(2)),
      reviewCount: count,
    });
  }
}
