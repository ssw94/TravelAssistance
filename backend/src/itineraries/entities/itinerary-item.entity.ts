import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItineraryDay } from './itinerary-day.entity';
import { ActivityType } from '../../common/enums';

@Entity('itinerary_items')
export class ItineraryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '09:00' })
  startTime: string; // e.g. "09:00"

  @Column({ nullable: true })
  endTime: string; // e.g. "11:00"

  @Column()
  title: string; // e.g. "Airport to Hotel Check-in"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ActivityType,
    default: ActivityType.SIGHTSEEING,
  })
  type: ActivityType;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  transportation: string; // e.g. "Taxi", "Metro", "Walking", "Rental Car"

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'int', default: 0 })
  orderIndex: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => ItineraryDay, (day) => day.items, { onDelete: 'CASCADE' })
  itineraryDay: ItineraryDay;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
