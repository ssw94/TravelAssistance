import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItineraryDay } from './entities/itinerary-day.entity';
import { ItineraryItem } from './entities/itinerary-item.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';
import {
  CreateItineraryDayDto,
  CreateItineraryItemDto,
  UpdateItineraryItemDto,
  ReorderItemsDto,
} from './dto/itinerary.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(ItineraryDay)
    private readonly dayRepository: Repository<ItineraryDay>,
    @InjectRepository(ItineraryItem)
    private readonly itemRepository: Repository<ItineraryItem>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async getTripItinerary(user: User, tripId: string): Promise<ItineraryDay[]> {
    await this.verifyTripAccess(user, tripId);

    return this.dayRepository
      .createQueryBuilder('day')
      .leftJoinAndSelect('day.items', 'items')
      .where('day.trip.id = :tripId', { tripId })
      .orderBy('day.dayNumber', 'ASC')
      .addOrderBy('items.orderIndex', 'ASC')
      .addOrderBy('items.startTime', 'ASC')
      .getMany();
  }

  async addDay(user: User, tripId: string, dto: CreateItineraryDayDto): Promise<ItineraryDay> {
    const trip = await this.verifyTripAccess(user, tripId);
    const day = this.dayRepository.create({
      ...dto,
      trip,
    });
    return this.dayRepository.save(day);
  }

  async removeDay(user: User, dayId: string) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['trip', 'trip.user'],
    });
    if (!day) throw new NotFoundException('Itinerary day not found');
    await this.verifyTripAccess(user, day.trip.id);

    await this.dayRepository.remove(day);
    return { success: true, message: 'Itinerary day deleted' };
  }

  async addItem(user: User, dayId: string, dto: CreateItineraryItemDto): Promise<ItineraryItem> {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['trip', 'trip.user', 'items'],
    });
    if (!day) throw new NotFoundException('Itinerary day not found');
    await this.verifyTripAccess(user, day.trip.id);

    const orderIndex = dto.orderIndex !== undefined ? dto.orderIndex : (day.items?.length || 0);

    const item = this.itemRepository.create({
      ...dto,
      orderIndex,
      itineraryDay: day,
    });

    return this.itemRepository.save(item);
  }

  async updateItem(user: User, itemId: string, dto: UpdateItineraryItemDto): Promise<ItineraryItem> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['itineraryDay', 'itineraryDay.trip', 'itineraryDay.trip.user'],
    });
    if (!item) throw new NotFoundException('Itinerary item not found');
    await this.verifyTripAccess(user, item.itineraryDay.trip.id);

    Object.assign(item, dto);
    return this.itemRepository.save(item);
  }

  async toggleComplete(user: User, itemId: string): Promise<ItineraryItem> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['itineraryDay', 'itineraryDay.trip', 'itineraryDay.trip.user'],
    });
    if (!item) throw new NotFoundException('Itinerary item not found');
    await this.verifyTripAccess(user, item.itineraryDay.trip.id);

    item.isCompleted = !item.isCompleted;
    return this.itemRepository.save(item);
  }

  async deleteItem(user: User, itemId: string) {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['itineraryDay', 'itineraryDay.trip', 'itineraryDay.trip.user'],
    });
    if (!item) throw new NotFoundException('Itinerary item not found');
    await this.verifyTripAccess(user, item.itineraryDay.trip.id);

    await this.itemRepository.remove(item);
    return { success: true, message: 'Itinerary item deleted' };
  }

  async reorderItems(user: User, dayId: string, dto: ReorderItemsDto) {
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['trip', 'trip.user'],
    });
    if (!day) throw new NotFoundException('Itinerary day not found');
    await this.verifyTripAccess(user, day.trip.id);

    const updatePromises = dto.items.map((it) =>
      this.itemRepository.update(it.id, { orderIndex: it.orderIndex }),
    );
    await Promise.all(updatePromises);

    return { success: true, message: 'Activities reordered successfully' };
  }

  private async verifyTripAccess(user: User, tripId: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['user', 'members', 'members.user'],
    });
    if (!trip) throw new NotFoundException('Trip not found');

    if (user.role !== UserRole.ADMIN && trip.user.id !== user.id) {
      const isMember = trip.members?.some((m) => m.user?.id === user.id);
      if (!isMember) {
        throw new ForbiddenException('Access denied for this trip');
      }
    }
    return trip;
  }
}
