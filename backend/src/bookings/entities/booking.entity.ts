import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Trip } from '../../trips/entities/trip.entity';
import { BookingType, BookingStatus } from '../../common/enums';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'enum',
    enum: BookingType,
    default: BookingType.HOTEL,
  })
  bookingType: BookingType;

  @Column()
  title: string; // e.g. "Indigo Flight 6E-204" or "Taj Exotica Resort"

  @Column()
  provider: string; // e.g. "IndiGo", "MakeMyTrip", "Booking.com", "Airbnb"

  @Column({ nullable: true })
  confirmationNumber: string;

  @Column({ type: 'timestamp' })
  startDateTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDateTime: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cost: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  details: {
    origin?: string;
    destination?: string;
    seatNumber?: string;
    roomType?: string;
    pickupLocation?: string;
    contactPhone?: string;
  };

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.bookings, { nullable: true, onDelete: 'SET NULL' })
  trip: Trip;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
