import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { ItineraryItem } from './itinerary-item.entity';

@Entity('itinerary_days')
export class ItineraryDay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 1 })
  dayNumber: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  title: string; // e.g. "Day 1 - Arrival & Beach Exploration"

  @Column({ type: 'text', nullable: true })
  summary: string;

  @ManyToOne(() => Trip, (trip) => trip.itineraryDays, { onDelete: 'CASCADE' })
  trip: Trip;

  @OneToMany(() => ItineraryItem, (item) => item.itineraryDay, {
    cascade: true,
    eager: true,
  })
  items: ItineraryItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
