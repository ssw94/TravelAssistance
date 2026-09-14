import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Destination } from './destination.entity';

@Entity('saved_destinations')
@Index(['user', 'destination'], { unique: true })
export class SavedDestination {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.savedDestinations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Destination, (dest) => dest.savedByUsers, { onDelete: 'CASCADE', eager: true })
  destination: Destination;

  @CreateDateColumn()
  createdAt: Date;
}
