import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Destination } from './entities/destination.entity';
import { DestinationImage } from './entities/destination-image.entity';
import { DestinationActivity } from './entities/destination-activity.entity';
import { SavedDestination } from './entities/saved-destination.entity';
import { User } from '../users/entities/user.entity';
import { CreateDestinationDto, FilterDestinationDto } from './dto/destination.dto';
import { PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(DestinationImage)
    private readonly imageRepository: Repository<DestinationImage>,
    @InjectRepository(DestinationActivity)
    private readonly activityRepository: Repository<DestinationActivity>,
    @InjectRepository(SavedDestination)
    private readonly savedRepository: Repository<SavedDestination>,
  ) {}

  async findAll(filter: FilterDestinationDto): Promise<PaginatedResult<Destination>> {
    const {
      page = 1,
      limit = 12,
      search,
      country,
      state,
      city,
      minBudget,
      maxBudget,
      travelType,
      season,
      minRating,
      trendingOnly,
      featuredOnly,
      sortBy = 'rating',
      order = 'DESC',
    } = filter;

    const skip = (page - 1) * limit;
    const query = this.destinationRepository
      .createQueryBuilder('dest')
      .leftJoinAndSelect('dest.gallery', 'gallery')
      .leftJoinAndSelect('dest.activities', 'activities');

    if (search) {
      query.andWhere(
        '(LOWER(dest.name) LIKE :s OR LOWER(dest.country) LIKE :s OR LOWER(dest.state) LIKE :s OR LOWER(dest.city) LIKE :s OR LOWER(dest.description) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    if (country) {
      query.andWhere('LOWER(dest.country) = :country', { country: country.toLowerCase() });
    }

    if (state) {
      query.andWhere('LOWER(dest.state) = :state', { state: state.toLowerCase() });
    }

    if (city) {
      query.andWhere('LOWER(dest.city) = :city', { city: city.toLowerCase() });
    }

    if (minBudget !== undefined) {
      query.andWhere('dest.startingBudget >= :minBudget', { minBudget });
    }

    if (maxBudget !== undefined) {
      query.andWhere('dest.startingBudget <= :maxBudget', { maxBudget });
    }

    if (minRating !== undefined) {
      query.andWhere('dest.rating >= :minRating', { minRating });
    }

    if (trendingOnly) {
      query.andWhere('dest.isTrending = true');
    }

    if (featuredOnly) {
      query.andWhere('dest.isFeatured = true');
    }

    if (travelType) {
      query.andWhere('dest.travelTypes LIKE :travelType', { travelType: `%${travelType}%` });
    }

    if (season) {
      query.andWhere('dest.bestSeasons LIKE :season', { season: `%${season}%` });
    }

    const sortField = ['rating', 'startingBudget', 'name', 'createdAt'].includes(sortBy)
      ? `dest.${sortBy}`
      : 'dest.rating';

    query.orderBy(sortField, order).skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Destination> {
    const destination = await this.destinationRepository
      .createQueryBuilder('dest')
      .leftJoinAndSelect('dest.gallery', 'gallery')
      .leftJoinAndSelect('dest.activities', 'activities')
      .leftJoinAndSelect('dest.reviews', 'reviews')
      .leftJoinAndSelect('reviews.user', 'reviewUser')
      .where('dest.id = :id', { id })
      .getOne();

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    return destination;
  }

  async getTrending(limit = 6): Promise<Destination[]> {
    return this.destinationRepository.find({
      where: { isTrending: true },
      take: limit,
      order: { rating: 'DESC' },
    });
  }

  async getRecommended(limit = 6): Promise<Destination[]> {
    return this.destinationRepository.find({
      take: limit,
      order: { rating: 'DESC', reviewCount: 'DESC' },
    });
  }

  async create(dto: CreateDestinationDto): Promise<Destination> {
    const destination = this.destinationRepository.create(dto);
    return this.destinationRepository.save(destination);
  }

  async update(id: string, dto: Partial<CreateDestinationDto>): Promise<Destination> {
    const destination = await this.findOne(id);
    Object.assign(destination, dto);
    return this.destinationRepository.save(destination);
  }

  async remove(id: string) {
    const result = await this.destinationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return { success: true, message: 'Destination deleted successfully' };
  }

  // Bookmarking / Saved Destinations
  async saveDestination(user: User, destinationId: string) {
    const destination = await this.findOne(destinationId);
    const existing = await this.savedRepository.findOne({
      where: { user: { id: user.id }, destination: { id: destination.id } },
    });

    if (existing) {
      throw new ConflictException('Destination already saved in wishlist');
    }

    const saved = this.savedRepository.create({
      user,
      destination,
    });
    await this.savedRepository.save(saved);

    return { success: true, message: 'Destination saved to wishlist' };
  }

  async unsaveDestination(user: User, destinationId: string) {
    const existing = await this.savedRepository.findOne({
      where: { user: { id: user.id }, destination: { id: destinationId } },
    });

    if (!existing) {
      throw new NotFoundException('Saved destination bookmark not found');
    }

    await this.savedRepository.remove(existing);
    return { success: true, message: 'Destination removed from wishlist' };
  }

  async getSavedDestinations(user: User) {
    const saved = await this.savedRepository.find({
      where: { user: { id: user.id } },
      relations: ['destination', 'destination.gallery', 'destination.activities'],
      order: { createdAt: 'DESC' },
    });
    return saved.map((s) => s.destination);
  }

  async isSaved(userId: string, destinationId: string): Promise<boolean> {
    const count = await this.savedRepository.count({
      where: { user: { id: userId }, destination: { id: destinationId } },
    });
    return count > 0;
  }
}
