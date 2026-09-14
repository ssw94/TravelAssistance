import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Destination } from './destination.entity';

@Entity('destination_activities')
export class DestinationActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedCost: number;

  @Column({ default: '2 hours' })
  duration: string;

  @Column({ nullable: true })
  category: string; // e.g. "Watersports", "Sightseeing", "Culinary", "Trekking"

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Destination, (dest) => dest.activities, { onDelete: 'CASCADE' })
  destination: Destination;

  @CreateDateColumn()
  createdAt: Date;
}
