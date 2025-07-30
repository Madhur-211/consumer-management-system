import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../models/user.model';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const sampleUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpass',
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        schema_name: 'business_1',
      };

      mockUsersService.create.mockResolvedValue(sampleUser);

      const result = await controller.create(dto);
      expect(result).toEqual(sampleUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([sampleUser]);

      const result = await controller.findAll();
      expect(result).toEqual([sampleUser]);
    });
  });

  describe('findOne', () => {
    it('should return one user by ID', async () => {
      mockUsersService.findOne.mockResolvedValue(sampleUser);

      const result = await controller.findOne('1');
      expect(result).toEqual(sampleUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update user and return the result', async () => {
      const updateDto = { name: 'Jane Doe' };
      mockUsersService.update.mockResolvedValue({ ...sampleUser, ...updateDto });

      const result = await controller.update('1', updateDto);
      expect(result).toEqual({ ...sampleUser, ...updateDto });
      expect(mockUsersService.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a user and return number of deleted rows', async () => {
      mockUsersService.remove.mockResolvedValue(1);

      const result = await controller.remove('1');
      expect(result).toBe(1);
      expect(mockUsersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
