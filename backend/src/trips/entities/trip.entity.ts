import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TripStatus, TravelStyle } from '../../common/enums';
import { Destination } from '../../destinations/entities/destination.entity';
import { TripMember } from './trip-member.entity';
import { ItineraryDay } from '../../itineraries/entities/itinerary-day.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string;

  @Column()
  destination: string; // Destination name string or city

  @ManyToOne(() => Destination, (d) => d.trips, { nullable: true, onDelete: 'SET NULL' })
  destinationEntity: Destination;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ default: 1 })
  numberOfTravelers: number;

  @Column({
    type: 'enum',
    enum: TravelStyle,
    default: TravelStyle.STANDARD,
  })
  travelStyle: TravelStyle;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.PLANNING,
  })
  status: TripStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  budget: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @ManyToOne(() => User, (user) => user.trips, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => TripMember, (member) => member.trip, { cascade: true })
  members: TripMember[];

  @OneToMany(() => ItineraryDay, (day) => day.trip, { cascade: true })
  itineraryDays: ItineraryDay[];

  @OneToMany(() => Booking, (booking) => booking.trip, { cascade: true })
  bookings: Booking[];

  @OneToMany(() => Expense, (expense) => expense.trip, { cascade: true })
  expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
