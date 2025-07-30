import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Consumer } from '../models/consumer.model';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';

describe('BusinessService', () => {
  let service: BusinessService;
  let sequelizeMock: { createSchema: jest.Mock };

  const mockSync = jest.fn();

  beforeEach(async () => {
    sequelizeMock = {
      createSchema: jest.fn(),
    };

    jest.spyOn(User, 'schema').mockReturnValue({ sync: mockSync } as any);
    jest.spyOn(Consumer, 'schema').mockReturnValue({ sync: mockSync } as any);
    jest.spyOn(CustomField, 'schema').mockReturnValue({ sync: mockSync } as any);
    jest.spyOn(ConsumerCustomFieldValue, 'schema').mockReturnValue({ sync: mockSync } as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        { provide: Sequelize, useValue: sequelizeMock },
      ],
    }).compile();

    service = module.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerNewBusiness()', () => {
    it('should create schema and sync all models in the schema', async () => {
      const schemaName = 'my_test_schema';

      await service.registerNewBusiness(schemaName);

      expect(sequelizeMock.createSchema).toHaveBeenCalledWith(schemaName, { logging: false });
      expect(User.schema).toHaveBeenCalledWith(schemaName);
      expect(Consumer.schema).toHaveBeenCalledWith(schemaName);
      expect(CustomField.schema).toHaveBeenCalledWith(schemaName);
      expect(ConsumerCustomFieldValue.schema).toHaveBeenCalledWith(schemaName);
      expect(mockSync).toHaveBeenCalledTimes(4);
      expect(mockSync).toHaveBeenCalledWith({ force: false });
    });
  });
});
