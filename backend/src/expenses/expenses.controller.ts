import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ExpenseCategory } from '../common/enums';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new expense' })
  async create(@CurrentUser() user: User, @Body() createDto: CreateExpenseDto) {
    return this.expensesService.create(user, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses for user' })
  @ApiQuery({ name: 'tripId', required: false })
  @ApiQuery({ name: 'category', enum: ExpenseCategory, required: false })
  async findAll(
    @CurrentUser() user: User,
    @Query('tripId') tripId?: string,
    @Query('category') category?: ExpenseCategory,
  ) {
    return this.expensesService.findAll(user, tripId, category);
  }

  @Get('trip/:tripId/breakdown')
  @ApiOperation({ summary: 'Get aggregated budget and expense breakdown for a trip' })
  async getTripBreakdown(
    @CurrentUser() user: User,
    @Param('tripId') tripId: string,
  ) {
    return this.expensesService.getTripBreakdown(user, tripId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single expense details' })
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.expensesService.findOne(user, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(user, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.expensesService.remove(user, id);
  }
}
