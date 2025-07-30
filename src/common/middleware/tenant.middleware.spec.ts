import { TenantMiddleware } from './tenant.middleware';
import { Request, Response, NextFunction } from 'express';

describe('TenantMiddleware', () => {
  let middleware: TenantMiddleware;
  let mockJwtService: any;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn().mockReturnValue({ schema: 'test_schema' }),
    };
    middleware = new TenantMiddleware(mockJwtService);
  });

  it('should extract schema from JWT and attach it to req', () => {
    const req: Partial<Request> = {
      headers: {
        authorization: 'Bearer fake.token.here',
      },
    };
    const res: Partial<Response> = {};
    const next = jest.fn();

    middleware.use(req as Request, res as Response, next as NextFunction);

    expect(mockJwtService.verify).toHaveBeenCalled();
    expect(req['schema']).toBe('test_schema');
    expect(next).toHaveBeenCalled();
  });
});
