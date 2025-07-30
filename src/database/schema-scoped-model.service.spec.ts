import { SchemaScopedModelService } from '../../src/database/schema-scoped-model.service';

describe('SchemaScopedModelService', () => {
  it('should return schema-scoped model', () => {
    const mockModel = { schema: jest.fn().mockReturnValue('scopedModel') };
    const req = { schema: 'test_schema' };

    const service = new SchemaScopedModelService(req as any);
    const result = service.getModel(mockModel);

    expect(mockModel.schema).toHaveBeenCalledWith('test_schema');
    expect(result).toBe('scopedModel');
  });

  it('should throw if schema is not in request', () => {
    const req = {}; // schema missing
    expect(() => new SchemaScopedModelService(req as any)).toThrow('Schema not found in request');
  });
});
