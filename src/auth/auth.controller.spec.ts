import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  const mockToken = {
    access_token: 'mock-jwt-token',
  };

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      mockAuthService.validateUser.mockResolvedValueOnce(mockUser);
      mockAuthService.login.mockResolvedValueOnce(mockToken);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValueOnce(null);

      await expect(
        controller.login({ email: 'wrong', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith('wrong', 'wrong');
    });
  });

  describe('signup', () => {
    it('should return newly created user data', async () => {
      const signupDto = {
        name: 'Test',
        email: 'new@example.com',
        password: 'password123',
        schema_name: 'business_1',
      };

      const createdUser = { id: 2, ...signupDto };
      mockAuthService.signup.mockResolvedValueOnce(createdUser);

      const result = await controller.signup(signupDto);

      expect(mockAuthService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(createdUser);
    });
  });
});
