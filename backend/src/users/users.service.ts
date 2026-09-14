import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { UpdateProfileDto, ChangePasswordDto } from './dto/user.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async getProfile(user: User): Promise<User> {
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['profile'],
    });
    if (!fullUser) {
      throw new NotFoundException('User profile not found');
    }
    return fullUser;
  }

  async updateProfile(user: User, dto: UpdateProfileDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['profile'],
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (dto.firstName) existingUser.firstName = dto.firstName;
    if (dto.lastName) existingUser.lastName = dto.lastName;
    if (dto.avatarUrl) existingUser.avatarUrl = dto.avatarUrl;

    await this.userRepository.save(existingUser);

    let profile = existingUser.profile;
    if (!profile) {
      profile = this.profileRepository.create({ user: existingUser });
    }

    if (dto.phoneNumber !== undefined) profile.phoneNumber = dto.phoneNumber;
    if (dto.dateOfBirth !== undefined) profile.dateOfBirth = dto.dateOfBirth;
    if (dto.preferredCurrency !== undefined) profile.preferredCurrency = dto.preferredCurrency;
    if (dto.preferredTravelStyle !== undefined) profile.preferredTravelStyle = dto.preferredTravelStyle;
    if (dto.favoriteDestinations !== undefined) profile.favoriteDestinations = dto.favoriteDestinations;
    if (dto.language !== undefined) profile.language = dto.language;
    if (dto.bio !== undefined) profile.bio = dto.bio;

    await this.profileRepository.save(profile);
    existingUser.profile = profile;

    return existingUser;
  }

  async changePassword(user: User, dto: ChangePasswordDto) {
    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id: user.id })
      .getOne();

    if (!userWithPassword) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, userWithPassword.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt(10);
    userWithPassword.passwordHash = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(userWithPassword);

    return { success: true, message: 'Password updated successfully' };
  }

  async deleteAccount(user: User) {
    await this.userRepository.delete(user.id);
    return { success: true, message: 'Account deleted successfully' };
  }

  // Admin Methods
  async findAll(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', order = 'DESC' } = pagination;
    const skip = (page - 1) * limit;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (search) {
      query.where(
        '(LOWER(user.firstName) LIKE :s OR LOWER(user.lastName) LIKE :s OR LOWER(user.email) LIKE :s)',
        { s: `%${search.toLowerCase()}%` },
      );
    }

    query.orderBy(`user.${sortBy}`, order).skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this.userRepository.save(user);
  }

  async toggleUserActive(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }

  async removeUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { success: true, message: 'User deleted' };
  }
}
