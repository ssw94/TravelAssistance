import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Trip } from './trip.entity';
import { User } from '../../users/entities/user.entity';

@Entity('trip_members')
export class TripMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip, (trip) => trip.members, { onDelete: 'CASCADE' })
  trip: Trip;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'VIEWER' })
  role: 'OWNER' | 'EDITOR' | 'VIEWER';

  @CreateDateColumn()
  joinedAt: Date;
}
