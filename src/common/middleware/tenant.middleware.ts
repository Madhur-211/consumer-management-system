import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = this.jwtService.verify(token) as any;
        console.log('Decoded JWT:', decoded);
        if (decoded?.schema) {
          req['schema'] = decoded.schema;
          console.log('Schema set to:', req['schema']);
        }
      } catch (err) {
        console.warn('Failed to decode JWT', err);
      }
    }
    next();
  }
}
