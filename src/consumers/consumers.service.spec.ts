import { Test, TestingModule } from '@nestjs/testing';
import { ConsumersService } from './consumers.service';
import { getModelToken } from '@nestjs/sequelize';
import { Consumer } from '../models/consumer.model';
import { NotFoundException } from '@nestjs/common';

const mockConsumerModel = {
  schema: jest.fn().mockReturnThis(),
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

describe('ConsumersService', () => {
  let service: ConsumersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumersService,
        {
          provide: getModelToken(Consumer),
          useValue: mockConsumerModel,
        },
      ],
    }).compile();

    service = module.get<ConsumersService>(ConsumersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const schema = 'test_schema';
  const userId = 'user123';
  const consumer_id = 'c123';

  describe('create', () => {
    it('should create a consumer', async () => {
      const dto = { name: 'John', email: 'john@example.com' };
      const created = { ...dto, consumer_id: 'abc123' };

      mockConsumerModel.create.mockResolvedValue(created);

      const result = await service.create(dto as any, userId, schema);

      expect(mockConsumerModel.schema).toHaveBeenCalledWith(schema);
      expect(mockConsumerModel.create).toHaveBeenCalledWith({
        ...dto,
        created_by: userId,
        updated_by: userId,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all consumers', async () => {
      const data = [{ consumer_id: '1' }, { consumer_id: '2' }];
      mockConsumerModel.findAll.mockResolvedValue(data);

      const result = await service.findAll(schema);
      expect(mockConsumerModel.schema).toHaveBeenCalledWith(schema);
      expect(mockConsumerModel.findAll).toHaveBeenCalledWith({ paranoid: false });
      expect(result).toEqual(data);
    });
  });

  describe('findOne', () => {
    it('should return a single consumer by ID', async () => {
      const data = { consumer_id: '1' };
      mockConsumerModel.findByPk.mockResolvedValue(data);

      const result = await service.findOne('1', schema);
      expect(mockConsumerModel.schema).toHaveBeenCalledWith(schema);
      expect(mockConsumerModel.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(data);
    });
  });

  describe('update', () => {
    it('should update a consumer and return result', async () => {
      const updated = [{ consumer_id: '1', name: 'Updated' }];
      mockConsumerModel.update.mockResolvedValue([1, updated]);

      const result = await service.update('1', { first_name: 'Updated' }, schema);
      expect(mockConsumerModel.schema).toHaveBeenCalledWith(schema);
      expect(mockConsumerModel.update).toHaveBeenCalledWith(
        { name: 'Updated' },
        { where: { consumer_id: '1' }, returning: true },
      );
      expect(result).toEqual([1, updated]);
    });
  });

  describe('remove', () => {
    it('should delete a consumer by ID', async () => {
      mockConsumerModel.destroy.mockResolvedValue(1);

      const result = await service.remove('1', schema);
      expect(mockConsumerModel.schema).toHaveBeenCalledWith(schema);
      expect(mockConsumerModel.destroy).toHaveBeenCalledWith({
        where: { consumer_id: '1' },
      });
      expect(result).toBe(1);
    });
  });

  describe('blockUnblock', () => {
    it('should toggle block status to true if not blocked', async () => {
      const mockConsumer = {
        consumer_id,
        is_blocked: false,
        save: jest.fn(),
      };
      mockConsumerModel.findByPk.mockResolvedValue(mockConsumer);

      const result = await service.blockUnblock(consumer_id, schema);
      expect(mockConsumer.is_blocked).toBe(true);
      expect(mockConsumer.save).toHaveBeenCalled();
      expect(result).toEqual(mockConsumer);
    });

    it('should toggle block status to false if already blocked', async () => {
      const mockConsumer = {
        consumer_id,
        is_blocked: true,
        save: jest.fn(),
      };
      mockConsumerModel.findByPk.mockResolvedValue(mockConsumer);

      const result = await service.blockUnblock(consumer_id, schema);
      expect(mockConsumer.is_blocked).toBe(false);
      expect(mockConsumer.save).toHaveBeenCalled();
      expect(result).toEqual(mockConsumer);
    });

    it('should throw NotFoundException if consumer not found', async () => {
      mockConsumerModel.findByPk.mockResolvedValue(null);

      await expect(service.blockUnblock('not_found', schema)).rejects.toThrow(NotFoundException);
    });
  });

  describe('testConsumer', () => {
    it('should toggle test consumer status to true if false', async () => {
      const mockConsumer = {
        consumer_id,
        is_test_consumer: false,
        save: jest.fn(),
      };
      mockConsumerModel.findByPk.mockResolvedValue(mockConsumer);

      const result = await service.testConsumer(consumer_id, schema);
      expect(mockConsumer.is_test_consumer).toBe(true);
      expect(mockConsumer.save).toHaveBeenCalled();
      expect(result).toEqual(mockConsumer);
    });

    it('should toggle test consumer status to false if true', async () => {
      const mockConsumer = {
        consumer_id,
        is_test_consumer: true,
        save: jest.fn(),
      };
      mockConsumerModel.findByPk.mockResolvedValue(mockConsumer);

      const result = await service.testConsumer(consumer_id, schema);
      expect(mockConsumer.is_test_consumer).toBe(false);
      expect(mockConsumer.save).toHaveBeenCalled();
      expect(result).toEqual(mockConsumer);
    });

    it('should throw NotFoundException if consumer not found', async () => {
      mockConsumerModel.findByPk.mockResolvedValue(null);

      await expect(service.testConsumer('not_found', schema)).rejects.toThrow(NotFoundException);
    });
  });
});
