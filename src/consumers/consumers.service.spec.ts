import { Test, TestingModule } from '@nestjs/testing';
import { ConsumersService } from './consumers.service';
import { getModelToken } from '@nestjs/sequelize';
import { Consumer } from '../models/consumer.model';
import { CreateConsumerDto } from './dto/create-consumer.dto';

describe('ConsumersService', () => {
  let service: ConsumersService;
  let consumerModel: any;

  const mockConsumer = {
    consumer_id: '1',
    name: 'John Doe',
    is_blocked: false,
    is_test_consumer: false,
    save: jest.fn(),
  };

  const schema = 'test_schema';

  beforeEach(async () => {
    const mockModel = {
      schema: jest.fn().mockReturnThis(),
      create: jest.fn().mockResolvedValue(mockConsumer),
      findAll: jest.fn().mockResolvedValue([mockConsumer]),
      findByPk: jest
        .fn()
        .mockResolvedValue({ ...mockConsumer, save: jest.fn() }),
      update: jest.fn().mockResolvedValue([1]),
      destroy: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumersService,
        {
          provide: getModelToken(Consumer),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ConsumersService>(ConsumersService);
    consumerModel = module.get(getModelToken(Consumer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a consumer', async () => {
      const dto = { name: 'John Doe' };
      const result = await service.create(dto as any, 'userId123', schema);
      expect(consumerModel.schema).toHaveBeenCalledWith(schema);
      expect(consumerModel.create).toHaveBeenCalledWith({
        name: 'John Doe',
        created_by: 'userId123',
        updated_by: 'userId123',
      });
      expect(result).toEqual(mockConsumer);
    });
  });

  describe('findAll', () => {
    it('should return all consumers', async () => {
      const result = await service.findAll(schema);
      expect(consumerModel.schema).toHaveBeenCalledWith(schema);
      expect(result).toEqual([mockConsumer]);
    });
  });

  describe('findOne', () => {
    it('should return a consumer by ID', async () => {
      const result = await service.findOne('1', schema);
      expect(consumerModel.schema).toHaveBeenCalledWith(schema);
      expect(consumerModel.findByPk).toHaveBeenCalledWith('1');
      expect(result).not.toBeNull();
      expect(result?.consumer_id).toEqual('1');
    });
  });

  describe('update', () => {
    it('should update a consumer', async () => {
      const dto: Partial<CreateConsumerDto> = {
        first_name: 'Updated Name',
        email: 'test@example.com',
        phone: '1234567890',
      };

      const result = await service.update('1', dto, schema);
      expect(consumerModel.schema).toHaveBeenCalledWith(schema);
      expect(result).toEqual([1]);
    });
  });

  describe('remove', () => {
    it('should delete a consumer', async () => {
      const result = await service.remove('1', schema);
      expect(consumerModel.schema).toHaveBeenCalledWith(schema);
      expect(result).toEqual(1);
    });
  });

  describe('blockUnblock', () => {
    it('should toggle is_blocked', async () => {
      const consumer = {
        ...mockConsumer,
        is_blocked: false,
        save: jest.fn(),
      };
      consumerModel.findByPk.mockResolvedValue(consumer);

      const result = await service.blockUnblock('1', schema);
      expect(result.is_blocked).toBe(true);
      expect(consumer.save).toHaveBeenCalled();
    });
  });

  describe('testConsumer', () => {
    it('should toggle is_test_consumer', async () => {
      const consumer = {
        ...mockConsumer,
        is_test_consumer: false,
        save: jest.fn(),
      };
      consumerModel.findByPk.mockResolvedValue(consumer);

      const result = await service.testConsumer('1', schema);
      expect(result.is_test_consumer).toBe(true);
      expect(consumer.save).toHaveBeenCalled();
    });
  });
});
