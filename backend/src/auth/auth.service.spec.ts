import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { UserRole } from '../common/enums';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: any;
  let profileRepo: any;
  let refreshTokenRepo: any;
  let jwtService: any;

  const mockUser: Partial<User> = {
    id: 'user-uuid-1',
    email: 'sachin@example.com',
    firstName: 'Sachin',
    lastName: 'Sharma',
    role: UserRole.USER,
    isActive: true,
    passwordHash: '$2b$10$hashedpassword',
  };

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockImplementation((dto) => ({ id: 'new-id', ...dto })),
      save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 'saved-id', ...user })),
      createQueryBuilder: jest.fn().mockReturnValue({
        addSelect: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      }),
    };

    profileRepo = {
      create: jest.fn().mockImplementation((p) => p),
      save: jest.fn().mockImplementation((p) => Promise.resolve(p)),
    };

    refreshTokenRepo = {
      create: jest.fn().mockImplementation((t) => t),
      save: jest.fn().mockImplementation((t) => Promise.resolve(t)),
      find: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mocked.jwt.token'),
      verify: jest.fn().mockReturnValue({ sub: 'user-uuid-1', email: 'sachin@example.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(UserProfile), useValue: profileRepo },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshTokenRepo },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'jwt.secret') return 'test_secret';
              if (key === 'jwt.refreshSecret') return 'test_refresh_secret';
              if (key === 'jwt.expiration') return '1h';
              if (key === 'jwt.refreshExpiration') return '7d';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    userRepo.findOne.mockResolvedValue(null);

    const result = await service.register({
      firstName: 'Sachin',
      lastName: 'Sharma',
      email: 'sachin@example.com',
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });

    expect(result).toBeDefined();
    expect(result.tokens.accessToken).toBe('mocked.jwt.token');
    expect(result.user.email).toBe('sachin@example.com');
  });

  it('should reject registration if passwords do not match', async () => {
    await expect(
      service.register({
        firstName: 'Sachin',
        lastName: 'Sharma',
        email: 'sachin@example.com',
        password: 'Password@123',
        confirmPassword: 'DifferentPassword@123',
      }),
    ).rejects.toThrow('Passwords do not match');
  });
});
