import { Test, TestingModule } from '@nestjs/testing';
import { CustomFieldsService } from './custom-fields.service';
import { getModelToken } from '@nestjs/sequelize';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';

describe('CustomFieldsService', () => {
  let service: CustomFieldsService;
  let customFieldModel: any;
  let customFieldValueModel: any;

  const schema = 'test_schema';

  beforeEach(async () => {
    customFieldModel = {
      schema: jest.fn().mockReturnThis(),
      create: jest.fn(),
    };

    customFieldValueModel = {
      schema: jest.fn().mockReturnThis(),
      bulkCreate: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomFieldsService,
        {
          provide: getModelToken(CustomField),
          useValue: customFieldModel,
        },
        {
          provide: getModelToken(ConsumerCustomFieldValue),
          useValue: customFieldValueModel,
        },
      ],
    }).compile();

    service = module.get<CustomFieldsService>(CustomFieldsService);
  });

  describe('createCustomField', () => {
    it('should create a custom field', async () => {
      const dto = { name: 'Test Field', type: 'text' };
      const createdField = { id: 1, ...dto };

      customFieldModel.create.mockResolvedValue(createdField);

      const result = await service.createCustomField(dto, schema);
      expect(customFieldModel.schema).toHaveBeenCalledWith(schema);
      expect(customFieldModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdField);
    });
  });

  describe('assignCustomFieldValues', () => {
    it('should assign values using bulkCreate', async () => {
      const values = [
        { consumer_id: '1', field_id: 1, value: 'John' },
        { consumer_id: '1', field_id: 2, value: '25' },
      ];

      customFieldValueModel.bulkCreate.mockResolvedValue(values);

      const result = await service.assignCustomFieldValues(values, schema);
      expect(customFieldValueModel.schema).toHaveBeenCalledWith(schema);
      expect(customFieldValueModel.bulkCreate).toHaveBeenCalledWith(values);
      expect(result).toEqual(values);
    });
  });

  describe('getConsumerFields', () => {
    it('should return consumer field values with included custom fields', async () => {
      const consumerId = '1';
      const mockResults = [
        {
          consumer_id: '1',
          field_id: 1,
          value: 'Some value',
          CustomField: { name: 'Field Name', type: 'text' },
        },
      ];

      customFieldValueModel.findAll.mockResolvedValue(mockResults);

      const result = await service.getConsumerFields(consumerId, schema);
      expect(customFieldValueModel.schema).toHaveBeenCalledWith(schema);
      expect(customFieldValueModel.findAll).toHaveBeenCalledWith({
        where: { consumer_id: consumerId },
        include: [CustomField],
      });
      expect(result).toEqual(mockResults);
    });
  });
});
