import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Expense } from './entities/expense.entity';
import { Trip } from '../trips/entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { ExpenseCategory, UserRole } from '../common/enums';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async create(user: User, dto: CreateExpenseDto): Promise<Expense> {
    let trip: Trip | null = null;
    if (dto.tripId) {
      trip = await this.tripRepository.findOne({
        where: { id: dto.tripId },
        relations: ['user'],
      });
      if (!trip) {
        throw new NotFoundException('Associated trip not found');
      }
    }

    const expense = this.expenseRepository.create({
      ...dto,
      user,
      trip: trip || undefined,
    });

    return this.expenseRepository.save(expense);
  }

  async findAll(user: User, tripId?: string, category?: ExpenseCategory): Promise<Expense[]> {
    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.trip', 'trip')
      .leftJoinAndSelect('expense.user', 'user')
      .orderBy('expense.date', 'DESC');

    if (user.role !== UserRole.ADMIN) {
      query.where('expense.user.id = :userId', { userId: user.id });
    }

    if (tripId) {
      query.andWhere('expense.trip.id = :tripId', { tripId });
    }

    if (category) {
      query.andWhere('expense.category = :category', { category });
    }

    return query.getMany();
  }

  async findOne(user: User, id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['trip', 'user'],
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (user.role !== UserRole.ADMIN && expense.user.id !== user.id) {
      throw new ForbiddenException('Access denied to this expense');
    }

    return expense;
  }

  async update(user: User, id: string, dto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.findOne(user, id);

    if (dto.tripId !== undefined) {
      if (dto.tripId) {
        const trip = await this.tripRepository.findOne({ where: { id: dto.tripId } });
        if (!trip) throw new NotFoundException('Trip not found');
        expense.trip = trip;
      } else {
        expense.trip = null as any;
      }
    }

    Object.assign(expense, dto);
    return this.expenseRepository.save(expense);
  }

  async remove(user: User, id: string) {
    const expense = await this.findOne(user, id);
    await this.expenseRepository.remove(expense);
    return { success: true, message: 'Expense deleted successfully' };
  }

  async getTripBreakdown(user: User, tripId: string) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['user', 'expenses'],
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    if (user.role !== UserRole.ADMIN && trip.user.id !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    const expenses = trip.expenses || [];
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalBudget = Number(trip.budget) || 0;
    const remainingBudget = totalBudget - totalSpent;

    const categoryBreakdown: Record<string, { amount: number; percentage: number; count: number }> = {};

    Object.values(ExpenseCategory).forEach((cat) => {
      categoryBreakdown[cat] = { amount: 0, percentage: 0, count: 0 };
    });

    expenses.forEach((e) => {
      const cat = e.category;
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { amount: 0, percentage: 0, count: 0 };
      }
      categoryBreakdown[cat].amount += Number(e.amount);
      categoryBreakdown[cat].count += 1;
    });

    Object.keys(categoryBreakdown).forEach((cat) => {
      const amt = categoryBreakdown[cat].amount;
      categoryBreakdown[cat].percentage = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
    });

    return {
      tripId: trip.id,
      tripName: trip.name,
      totalBudget,
      totalSpent,
      remainingBudget,
      currency: trip.currency,
      spentPercentage: totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0,
      isOverBudget: totalSpent > totalBudget,
      categoryBreakdown,
      recentExpenses: expenses.slice(0, 5),
    };
  }
}
