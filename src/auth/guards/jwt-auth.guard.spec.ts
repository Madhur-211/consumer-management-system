import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('canActivate should return true (mocked)', async () => {
    const context = {} as ExecutionContext;
    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});
