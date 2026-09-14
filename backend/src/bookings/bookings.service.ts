import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { BookingType, UserRole } from '../common/enums';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(user: User, dto: CreateBookingDto): Promise<Booking> {
    let trip: Trip | null = null;
    if (dto.tripId) {
      trip = await this.tripRepository.findOne({
        where: { id: dto.tripId },
        relations: ['user'],
      });
      if (!trip) {
        throw new NotFoundException('Associated trip not found');
      }
    }

    const booking = this.bookingRepository.create({
      ...dto,
      user,
      trip: trip || undefined,
    });

    return this.bookingRepository.save(booking);
  }

  async findAll(user: User, tripId?: string, type?: BookingType): Promise<Booking[]> {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.trip', 'trip')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.user.id = :userId', { userId: user.id })
      .orderBy('booking.startDateTime', 'ASC');

    if (tripId) {
      query.andWhere('booking.trip.id = :tripId', { tripId });
    }

    if (type) {
      query.andWhere('booking.bookingType = :type', { type });
    }

    return query.getMany();
  }

  async findOne(user: User, id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['trip', 'user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role !== UserRole.ADMIN && booking.user.id !== user.id) {
      throw new ForbiddenException('Access denied to this booking');
    }

    return booking;
  }

  async update(user: User, id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(user, id);

    if (dto.tripId !== undefined) {
      if (dto.tripId) {
        const trip = await this.tripRepository.findOne({ where: { id: dto.tripId } });
        if (!trip) throw new NotFoundException('Trip not found');
        booking.trip = trip;
      } else {
        booking.trip = null as any;
      }
    }

    Object.assign(booking, dto);
    return this.bookingRepository.save(booking);
  }

  async remove(user: User, id: string) {
    const booking = await this.findOne(user, id);
    await this.bookingRepository.remove(booking);
    return { success: true, message: 'Booking removed successfully' };
  }
}
