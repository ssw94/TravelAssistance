import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Trip } from '../trips/entities/trip.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Destination } from '../destinations/entities/destination.entity';
import { Review } from '../reviews/entities/review.entity';
import { TripStatus, BookingStatus } from '../common/enums';
import * as dayjs from 'dayjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getDashboardMetrics() {
    const today = dayjs().format('YYYY-MM-DD');

    const [
      totalUsers,
      activeUsers,
      totalTrips,
      upcomingTrips,
      totalBookings,
      totalDestinations,
      pendingReviews,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.tripRepository.count(),
      this.tripRepository.count({
        where: { startDate: MoreThanOrEqual(today), status: TripStatus.PLANNING },
      }),
      this.bookingRepository.count(),
      this.destinationRepository.count(),
      this.reviewRepository.count({ where: { status: 'PENDING' as any } }),
    ]);

    // Calculate total revenue from confirmed bookings
    const bookings = await this.bookingRepository.find({
      select: ['cost', 'bookingType', 'status'],
    });

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.cost || 0), 0);

    // Bookings count by type
    const bookingsByType: Record<string, number> = {};
    bookings.forEach((b) => {
      bookingsByType[b.bookingType] = (bookingsByType[b.bookingType] || 0) + 1;
    });

    // Top 5 popular destinations
    const popularDestinations = await this.destinationRepository.find({
      take: 5,
      order: { reviewCount: 'DESC', rating: 'DESC' },
      select: ['id', 'name', 'country', 'rating', 'reviewCount', 'startingBudget', 'coverImage'],
    });

    // Recent 5 users
    const recentUsers = await this.userRepository.find({
      take: 5,
      order: { createdAt: 'DESC' },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'createdAt'],
    });

    // Recent 5 trips
    const recentTrips = await this.tripRepository.find({
      take: 5,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return {
      metrics: {
        totalUsers,
        activeUsers,
        totalTrips,
        upcomingTrips,
        totalBookings,
        totalDestinations,
        pendingReviews,
        totalRevenue,
      },
      bookingsByType,
      popularDestinations,
      recentUsers,
      recentTrips,
    };
  }
}
