import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class SchemaScopedModelService {
  private schema: string;

  constructor(@Inject(REQUEST) private readonly req: Request) {
    this.schema = req['schema'];
    if (!this.schema) {
      throw new Error('Schema not found in request');
    }
  }

  getModel<T>(model: any): T {
    return model.schema(this.schema) as T;
  }
}
