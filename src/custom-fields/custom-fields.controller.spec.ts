import { Test, TestingModule } from '@nestjs/testing';
import { CustomFieldsController } from './custom-fields.controller';
import { CustomFieldsService } from './custom-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';

describe('CustomFieldsController', () => {
  let controller: CustomFieldsController;
  let service: CustomFieldsService;

  const mockCustomFieldsService = {
    createCustomField: jest.fn(),
    assignCustomFieldValues: jest.fn(),
    getConsumerFields: jest.fn(),
  };

  const mockUser = { id: 'user123' };
  const mockSchema = 'test_schema';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomFieldsController],
      providers: [
        {
          provide: CustomFieldsService,
          useValue: mockCustomFieldsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(TenantGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CustomFieldsController>(CustomFieldsController);
    service = module.get<CustomFieldsService>(CustomFieldsService);
  });

  describe('createField', () => {
    it('should call service.createCustomField with payload and schema', async () => {
      const body = { name: 'test_field' };
      const result = { id: '1', ...body };
      mockCustomFieldsService.createCustomField.mockResolvedValue(result);

      const response = await controller.createField(body, mockUser, mockSchema);

      expect(response).toEqual(result);
      expect(mockCustomFieldsService.createCustomField).toHaveBeenCalledWith(
        {
          ...body,
          created_by: mockUser.id,
          updated_by: mockUser.id,
        },
        mockSchema,
      );
    });
  });

  describe('assignValuesToConsumer', () => {
    it('should call service.assignCustomFieldValues with transformed values and schema', async () => {
      const consumerId = 'consumer123';
      const values = [
        { custom_field_id: 'field1', value: 'val1' },
        { custom_field_id: 'field2', value: 'val2' },
      ];
      const expected = values.map((val) => ({
        ...val,
        consumer_id: consumerId,
        created_by: mockUser.id,
        updated_by: mockUser.id,
      }));
      const result = [{ id: 'val1' }, { id: 'val2' }];
      mockCustomFieldsService.assignCustomFieldValues.mockResolvedValue(result);

      const response = await controller.assignValuesToConsumer(
        consumerId,
        values,
        mockUser,
        mockSchema,
      );

      expect(response).toEqual(result);
      expect(mockCustomFieldsService.assignCustomFieldValues).toHaveBeenCalledWith(
        expected,
        mockSchema,
      );
    });
  });

  describe('getConsumerFieldValues', () => {
    it('should call service.getConsumerFields with id and schema', async () => {
      const consumerId = 'consumer123';
      const result = [{ field: 'test', value: '123' }];
      mockCustomFieldsService.getConsumerFields.mockResolvedValue(result);

      const response = await controller.getConsumerFieldValues(
        consumerId,
        mockSchema,
      );

      expect(response).toEqual(result);
      expect(mockCustomFieldsService.getConsumerFields).toHaveBeenCalledWith(
        consumerId,
        mockSchema,
      );
    });
  });
});
