import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userSchema = request.schema;
    if (!userSchema) {
      throw new ForbiddenException('No schema associated with request');
    }

    const paramSchema = request.params?.schema || request.body?.schema;

    if (paramSchema && paramSchema !== userSchema) {
      throw new ForbiddenException('Access to unauthorized schema denied');
    }

    return true;
  }
}
