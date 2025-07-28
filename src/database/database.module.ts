import { Module } from '@nestjs/common';
import { SchemaScopedModelService } from './schema-scoped-model.service';

@Module({
  providers: [SchemaScopedModelService],
  exports: [SchemaScopedModelService],
})
export class DatabaseModule {}
