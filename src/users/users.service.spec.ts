import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    schema_name: 'business_1',
  };

  beforeEach(async () => {
    userModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and return a user', async () => {
      userModel.create.mockResolvedValue(mockUser);

      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
      expect(userModel.create).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll()', () => {
    it('should return all users', async () => {
      userModel.findAll.mockResolvedValue([mockUser]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne()', () => {
    it('should return a user by ID', async () => {
      userModel.findByPk.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
      expect(userModel.findByPk).toHaveBeenCalledWith('1');
    });
  });

  describe('update()', () => {
    it('should update a user and return the result', async () => {
      userModel.update.mockResolvedValue([1, [mockUser]]);

      const result = await service.update('1', { name: 'Updated' });
      expect(result).toEqual([1, [mockUser]]);
      expect(userModel.update).toHaveBeenCalledWith(
        { name: 'Updated' },
        { where: { id: '1' }, returning: true },
      );
    });
  });

  describe('remove()', () => {
    it('should delete a user and return number of deleted rows', async () => {
      userModel.destroy.mockResolvedValue(1);

      const result = await service.remove('1');
      expect(result).toBe(1);
      expect(userModel.destroy).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('findByEmail()', () => {
    it('should return a user by email', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUser);
      expect(userModel.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        attributes: ['id', 'name', 'email', 'password', 'schema_name'],
      });
    });
  });
});
