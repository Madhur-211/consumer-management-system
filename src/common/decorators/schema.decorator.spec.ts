import { Schema } from './schema.decorator';
import { ExecutionContext } from '@nestjs/common';

describe('Schema Decorator', () => {
  it('should extract schema from request', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          schema: 'test_schema',
        }),
      }),
    } as unknown as ExecutionContext;

    const result = Schema(null, mockContext);
    expect(result).toBe('test_schema');
  });

  it('should return undefined if no schema in request', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const result = Schema(null, mockContext);
    expect(result).toBeUndefined();
  });
});
