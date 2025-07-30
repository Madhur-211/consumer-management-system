import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'test_jwt_secret';
      }),
    };

    jwtStrategy = new JwtStrategy(mockConfigService as any);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return payload structure', async () => {
    const payload = { sub: 1, email: 'test@example.com' };
    const result = await jwtStrategy.validate(payload);
    expect(result).toEqual({ userId: 1, email: 'test@example.com' });
  });
});
