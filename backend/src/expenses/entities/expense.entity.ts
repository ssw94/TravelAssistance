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
import { ExpenseCategory } from '../../common/enums';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ExpenseCategory,
    default: ExpenseCategory.OTHER,
  })
  category: ExpenseCategory;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  paymentMethod: string; // e.g. "Credit Card", "UPI", "Cash"

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Trip, (trip) => trip.expenses, { nullable: true, onDelete: 'CASCADE' })
  trip: Trip;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
