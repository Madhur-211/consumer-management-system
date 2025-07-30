import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';

describe('BusinessController', () => {
  let controller: BusinessController;
  let service: BusinessService;

  const mockBusinessService = {
    registerNewBusiness: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: mockBusinessService,
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerBusiness()', () => {
    it('should call service and return success message', async () => {
      const schemaName = 'new_schema';
      const result = await controller.registerBusiness({ schemaName });

      expect(service.registerNewBusiness).toHaveBeenCalledWith(schemaName);
      expect(result).toEqual({
        message: `✅ Business "${schemaName}" registered successfully.`,
      });
    });
  });
});
