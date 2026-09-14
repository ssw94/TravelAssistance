import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth-requests.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new BadRequestException('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepository.create({
      email: dto.email.toLowerCase(),
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash,
      role: UserRole.USER,
      isActive: true,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.firstName)}`,
    });

    const savedUser = await this.userRepository.save(user);

    const profile = this.profileRepository.create({
      user: savedUser,
      preferredCurrency: 'INR',
      language: 'en',
    });
    await this.profileRepository.save(profile);

    savedUser.profile = profile;
    const tokens = await this.generateTokens(savedUser);
    await this.saveRefreshToken(savedUser, tokens.refreshToken);

    return {
      user: this.sanitizeUser(savedUser),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', { email: dto.email.toLowerCase() })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user, dto.rememberMe);
    await this.saveRefreshToken(user, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'super_secure_travel_jwt_refresh_secret_key_2026_abc!',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.sub, isActive: true },
      relations: ['profile'],
    });
    if (!user) {
      throw new UnauthorizedException('User no longer exists or is inactive');
    }

    const validTokens = await this.refreshTokenRepository.find({
      where: {
        user: { id: user.id },
        isRevoked: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    let matchedTokenRecord: RefreshToken | null = null;
    for (const tokenRecord of validTokens) {
      const isMatch = await bcrypt.compare(dto.refreshToken, tokenRecord.tokenHash);
      if (isMatch) {
        matchedTokenRecord = tokenRecord;
        break;
      }
    }

    if (!matchedTokenRecord) {
      // Possible reuse attack -> revoke all tokens
      await this.refreshTokenRepository.update({ user: { id: user.id } }, { isRevoked: true });
      throw new UnauthorizedException('Invalid refresh token. Security revocation triggered.');
    }

    // Revoke old token (Rotation)
    matchedTokenRecord.isRevoked = true;
    await this.refreshTokenRepository.save(matchedTokenRecord);

    // Issue new tokens
    const newTokens = await this.generateTokens(user);
    await this.saveRefreshToken(user, newTokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens: newTokens,
    };
  }

  async logout(user: User, refreshToken?: string) {
    if (refreshToken) {
      const validTokens = await this.refreshTokenRepository.find({
        where: { user: { id: user.id }, isRevoked: false },
      });
      for (const tokenRecord of validTokens) {
        const isMatch = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);
        if (isMatch) {
          tokenRecord.isRevoked = true;
          await this.refreshTokenRepository.save(tokenRecord);
          break;
        }
      }
    } else {
      await this.refreshTokenRepository.update(
        { user: { id: user.id } },
        { isRevoked: true },
      );
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async logoutAll(user: User) {
    await this.refreshTokenRepository.update(
      { user: { id: user.id } },
      { isRevoked: true },
    );
    return { success: true, message: 'Logged out from all devices successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    // To prevent email enumeration attack, always return success message
    if (!user) {
      return {
        success: true,
        message: 'If the email exists in our system, a password reset link has been dispatched.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 3600 * 1000); // 1 hour
    await this.userRepository.save(user);

    this.logger.log(`Password reset requested for ${user.email}. Development Reset Token: ${resetToken}`);

    return {
      success: true,
      message: 'If the email exists in our system, a password reset link has been dispatched.',
      // For local testing convenience, return dev token in non-production
      ...(process.env.NODE_ENV !== 'production' && { devResetToken: resetToken }),
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordResetToken')
      .addSelect('user.passwordResetExpires')
      .where('user.passwordResetToken = :hashedToken', { hashedToken })
      .andWhere('user.passwordResetExpires > :now', { now: new Date() })
      .getOne();

    if (!user) {
      throw new BadRequestException('Password reset token is invalid or has expired');
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(dto.password, salt);
    user.passwordResetToken = null as any;
    user.passwordResetExpires = null as any;
    await this.userRepository.save(user);

    // Revoke all existing sessions
    await this.refreshTokenRepository.update({ user: { id: user.id } }, { isRevoked: true });

    return {
      success: true,
      message: 'Password has been reset successfully. You may now log in with your new password.',
    };
  }

  private async generateTokens(user: User, rememberMe = false) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessExpiry = this.configService.get<string>('jwt.expiration') || '1h';
    const refreshExpiry = rememberMe ? '30d' : (this.configService.get<string>('jwt.refreshExpiration') || '7d');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret') || 'super_secure_travel_jwt_secret_key_2026_xyz!',
        expiresIn: accessExpiry as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret') || 'super_secure_travel_jwt_refresh_secret_key_2026_abc!',
        expiresIn: refreshExpiry as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: accessExpiry,
    };
  }

  private async saveRefreshToken(user: User, rawToken: string) {
    const salt = await bcrypt.genSalt(8);
    const tokenHash = await bcrypt.hash(rawToken, salt);

    const tokenRecord = this.refreshTokenRepository.create({
      user,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      isRevoked: false,
    });
    await this.refreshTokenRepository.save(tokenRecord);
  }

  public sanitizeUser(user: User) {
    const { passwordHash, passwordResetToken, passwordResetExpires, ...safeUser } = user as any;
    return safeUser;
  }
}
