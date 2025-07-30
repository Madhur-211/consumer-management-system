import { CurrentUser } from './current-user.decorator';
import { ExecutionContext } from '@nestjs/common';

describe('CurrentUser Decorator', () => {
  it('should return user from request', () => {
    const user = { id: 1, name: 'John' };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;

    const result = CurrentUser(null, mockContext);
    expect(result).toEqual(user);
  });

  it('should return undefined if user not found', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    const result = CurrentUser(null, mockContext);
    expect(result).toBeUndefined();
  });
});
