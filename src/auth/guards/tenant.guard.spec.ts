import { TenantGuard } from './tenant.guard';
import { ExecutionContext } from '@nestjs/common';

describe('TenantGuard', () => {
  let guard: TenantGuard;

  beforeEach(() => {
    guard = new TenantGuard();
  });

  it('should return true if schema exists in request', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ schema: 'test_schema' }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should return false if schema is missing in request', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
