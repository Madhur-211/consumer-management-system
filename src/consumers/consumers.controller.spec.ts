import { Test, TestingModule } from '@nestjs/testing';
import { ConsumersController } from './consumers.controller';
import { ConsumersService } from './consumers.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';

describe('ConsumersController', () => {
  let controller: ConsumersController;
  let service: ConsumersService;

  const schema = 'tenant1';

  const mockConsumer = {
    id: '1',
    name: 'John Doe',
    phone: '1234567890',
    status: 'active',
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumersController],
      providers: [{ provide: ConsumersService, useValue: mockService }],
    }).compile();

    controller = module.get<ConsumersController>(ConsumersController);
    service = module.get<ConsumersService>(ConsumersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the created consumer', async () => {
      const dto: CreateConsumerDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@email.com',
        address: 'johnhome',
        phone: '1234567890',
      };

      mockService.create.mockResolvedValueOnce(mockConsumer);

      const mockUser = { id: 1 };
      const result = await controller.create( dto, mockUser, schema);

      expect(service.create).toHaveBeenCalledWith(dto, schema);
      expect(result).toEqual(mockConsumer);
    });
  });

  describe('findAll', () => {
    it('should return an array of consumers', async () => {
      mockService.findAll.mockResolvedValueOnce([mockConsumer]);

      const result = await controller.findAll(schema);

      expect(service.findAll).toHaveBeenCalledWith(schema);
      expect(result).toEqual([mockConsumer]);
    });
  });

  describe('findOne', () => {
    it('should return a single consumer', async () => {
      mockService.findOne.mockResolvedValueOnce(mockConsumer);

      const result = await controller.findOne('1', schema);

      expect(service.findOne).toHaveBeenCalledWith('1', schema);
      expect(result).toEqual(mockConsumer);
    });
  });

  describe('update', () => {
    it('should update and return the consumer', async () => {
      const updateDto: UpdateConsumerDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@email.com',
        address: 'johnhome',
        phone: '1234567890',
      };

      const updated = { ...mockConsumer, ...updateDto };
      mockService.update.mockResolvedValueOnce(updated);

      const mockUser = { id: 1 };
      const result = await controller.update('1', updateDto, mockUser, schema);

      expect(service.update).toHaveBeenCalledWith('1', updateDto, schema);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should delete the consumer and return the result', async () => {
      mockService.remove.mockResolvedValueOnce(1);

      const result = await controller.remove('1', schema);

      expect(service.remove).toHaveBeenCalledWith('1', schema);
      expect(result).toBe(1);
    });
  });
});
