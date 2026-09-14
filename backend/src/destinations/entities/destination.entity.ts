import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { DestinationImage } from './destination-image.entity';
import { DestinationActivity } from './destination-activity.entity';
import { Review } from '../../reviews/entities/review.entity';
import { SavedDestination } from './saved-destination.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column()
  country: string;

  @Index()
  @Column({ nullable: true })
  state: string;

  @Index()
  @Column({ nullable: true })
  city: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ default: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' })
  coverImage: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 4.5 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 5000 })
  startingBudget: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ nullable: true })
  bestTimeToVisit: string;

  @Column({ type: 'simple-array', nullable: true })
  bestSeasons: string[]; // e.g. ["Winter", "Spring", "Monsoon", "Autumn"]

  @Column({ type: 'simple-array', nullable: true })
  travelTypes: string[]; // e.g. ["Beach", "Adventure", "Heritage", "Romantic", "Nature"]

  @Column({ default: '3-5 days' })
  suggestedDuration: string;

  @Column({ type: 'jsonb', nullable: true })
  weatherInfo: {
    averageTemp: string;
    condition: string;
    humidity: string;
    rainyDaysPerMonth?: number;
  };

  @Column({ type: 'simple-array', nullable: true })
  popularAttractions: string[];

  @Column({ type: 'simple-array', nullable: true })
  recommendedHotels: string[];

  @Column({ type: 'simple-array', nullable: true })
  recommendedRestaurants: string[];

  @Column({ type: 'text', nullable: true })
  transportationInfo: string;

  @Column({ type: 'text', nullable: true })
  safetyTips: string;

  @Column({ type: 'text', nullable: true })
  localTips: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ default: false })
  isTrending: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @OneToMany(() => DestinationImage, (image) => image.destination, {
    cascade: true,
    eager: true,
  })
  gallery: DestinationImage[];

  @OneToMany(() => DestinationActivity, (activity) => activity.destination, {
    cascade: true,
    eager: true,
  })
  activities: DestinationActivity[];

  @OneToMany(() => Review, (review) => review.destination)
  reviews: Review[];

  @OneToMany(() => SavedDestination, (saved) => saved.destination)
  savedByUsers: SavedDestination[];

  @OneToMany(() => Trip, (trip) => trip.destinationEntity)
  trips: Trip[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
