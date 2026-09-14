import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TravelStyle } from '../../common/enums';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ default: 'INR' })
  preferredCurrency: string;

  @Column({
    type: 'enum',
    enum: TravelStyle,
    default: TravelStyle.STANDARD,
  })
  preferredTravelStyle: TravelStyle;

  @Column({ type: 'simple-array', nullable: true })
  favoriteDestinations: string[];

  @Column({ default: 'en' })
  language: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
