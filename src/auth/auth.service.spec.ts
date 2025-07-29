jest.mock('../models/user.model', () => {
  const actualModel = jest.requireActual('../models/user.model');

  return {
    ...actualModel,
    User: {
      ...actualModel.User,
      schema: jest.fn().mockReturnValue({
        build: jest.fn().mockReturnValue({
          save: jest.fn(),
        }),
      }),
    },
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  let mockUser: any;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      schema_name: 'business_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      get: function () {
        return this;
      },
    };

    usersService = {
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      const result = await authService.validateUser('test@example.com', 'password123');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      const result = await authService.validateUser('notfound@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const wrongPasswordUser = { ...mockUser, password: await bcrypt.hash('wrongpassword', 10) };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(wrongPasswordUser);
      const result = await authService.validateUser('test@example.com', 'password123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      const result = await authService.login(mockUser);
      expect(result).toEqual({ access_token: 'signed-jwt-token' });
    });
  });

  describe('signup', () => {
    it('should create user and return it', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        schema_name: 'business_1',
      };

      const result = await authService.signup(userDto);

        expect(result).toBeDefined();
    });
  });
});
