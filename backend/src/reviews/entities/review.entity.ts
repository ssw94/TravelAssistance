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
import { Destination } from '../../destinations/entities/destination.entity';
import { ReviewStatus } from '../../common/enums';

@Entity('reviews')
@Index(['user', 'destination'], { unique: false })
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number; // 1 to 5

  @Column()
  title: string;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.APPROVED,
  })
  status: ReviewStatus;

  @Column({ default: 0 })
  helpfulVotes: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE', eager: true })
  user: User;

  @ManyToOne(() => Destination, (dest) => dest.reviews, { onDelete: 'CASCADE' })
  destination: Destination;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
