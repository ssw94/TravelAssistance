import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

import { Trip } from './entities/trip.entity';
import { TripMember } from './entities/trip-member.entity';
import { ItineraryDay } from '../itineraries/entities/itinerary-day.entity';
import { Destination } from '../destinations/entities/destination.entity';
import { User } from '../users/entities/user.entity';
import { CreateTripDto, UpdateTripDto } from './dto/trip.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripMember)
    private readonly memberRepository: Repository<TripMember>,
    @InjectRepository(ItineraryDay)
    private readonly dayRepository: Repository<ItineraryDay>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  async create(user: User, dto: CreateTripDto): Promise<Trip> {
    let destinationEntity: Destination | null = null;
    let coverImageUrl = dto.coverImageUrl;

    if (dto.destinationId) {
      destinationEntity = await this.destinationRepository.findOne({
        where: { id: dto.destinationId },
      });
      if (destinationEntity && !coverImageUrl) {
        coverImageUrl = destinationEntity.coverImage;
      }
    }

    if (!coverImageUrl) {
      coverImageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828';
    }

    const trip = this.tripRepository.create({
      ...dto,
      coverImageUrl,
      user,
      destinationEntity: destinationEntity || undefined,
    });

    const savedTrip = await this.tripRepository.save(trip);

    // Auto-generate itinerary days for the date range
    const start = dayjs(dto.startDate);
    const end = dayjs(dto.endDate);
    const totalDays = Math.max(1, end.diff(start, 'day') + 1);

    const daysToInsert: ItineraryDay[] = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDayDate = start.add(i, 'day').format('YYYY-MM-DD');
      const day = this.dayRepository.create({
        trip: savedTrip,
        dayNumber: i + 1,
        date: currentDayDate,
        title: `Day ${i + 1}`,
        summary: i === 0 ? 'Arrival & Initial Check-in' : (i === totalDays - 1 ? 'Departure & Final Highlights' : 'Explore & Activities'),
      });
      daysToInsert.push(day);
    }
    await this.dayRepository.save(daysToInsert);

    // Add owner as trip member
    const member = this.memberRepository.create({
      trip: savedTrip,
      user,
      role: 'OWNER',
    });
    await this.memberRepository.save(member);

    return this.findOne(user, savedTrip.id);
  }

  async findAll(user: User): Promise<Trip[]> {
    if (user.role === UserRole.ADMIN) {
      return this.tripRepository.find({
        relations: ['user', 'itineraryDays', 'bookings', 'expenses'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.user', 'user')
      .leftJoinAndSelect('trip.itineraryDays', 'itineraryDays')
      .leftJoinAndSelect('trip.bookings', 'bookings')
      .leftJoinAndSelect('trip.expenses', 'expenses')
      .where('trip.user.id = :userId', { userId: user.id })
      .orderBy('trip.startDate', 'ASC')
      .getMany();
  }

  async findOne(user: User, id: string): Promise<Trip> {
    const trip = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.user', 'user')
      .leftJoinAndSelect('trip.destinationEntity', 'dest')
      .leftJoinAndSelect('trip.itineraryDays', 'itineraryDays')
      .leftJoinAndSelect('itineraryDays.items', 'items')
      .leftJoinAndSelect('trip.bookings', 'bookings')
      .leftJoinAndSelect('trip.expenses', 'expenses')
      .leftJoinAndSelect('trip.members', 'members')
      .leftJoinAndSelect('members.user', 'memberUser')
      .where('trip.id = :id', { id })
      .orderBy('itineraryDays.dayNumber', 'ASC')
      .addOrderBy('items.orderIndex', 'ASC')
      .getOne();

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN && trip.user.id !== user.id) {
      const isMember = trip.members?.some((m) => m.user?.id === user.id);
      if (!isMember) {
        throw new ForbiddenException('You do not have access to this trip');
      }
    }

    return trip;
  }

  async update(user: User, id: string, dto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findOne(user, id);
    Object.assign(trip, dto);
    await this.tripRepository.save(trip);
    return this.findOne(user, id);
  }

  async remove(user: User, id: string) {
    const trip = await this.findOne(user, id);
    if (user.role !== UserRole.ADMIN && trip.user.id !== user.id) {
      throw new ForbiddenException('Only the trip owner or admin can delete this trip');
    }
    await this.tripRepository.remove(trip);
    return { success: true, message: 'Trip deleted successfully' };
  }

  async getSummary(user: User, id: string) {
    const trip = await this.findOne(user, id);

    const totalSpent = (trip.expenses || []).reduce(
      (sum, exp) => sum + Number(exp.amount),
      0,
    );
    const totalBudget = Number(trip.budget) || 0;
    const remainingBudget = Math.max(0, totalBudget - totalSpent);

    let totalActivities = 0;
    let completedActivities = 0;
    (trip.itineraryDays || []).forEach((d) => {
      (d.items || []).forEach((item) => {
        totalActivities++;
        if (item.isCompleted) completedActivities++;
      });
    });

    return {
      tripId: trip.id,
      name: trip.name,
      destination: trip.destination,
      totalBudget,
      totalSpent,
      remainingBudget,
      currency: trip.currency,
      daysCount: trip.itineraryDays?.length || 0,
      bookingsCount: trip.bookings?.length || 0,
      totalActivities,
      completedActivities,
      progressPercentage: totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0,
    };
  }
}
