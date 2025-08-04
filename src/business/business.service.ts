import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Consumer } from '../models/consumer.model';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';
import { User } from '../models/user.model';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class BusinessService {
  constructor(private readonly sequelize: Sequelize,
    private readonly logger: PinoLogger,
  ) {}

  async registerNewBusiness(schemaName: string) {
    try {
      this.logger.info(`Creating schema: ${schemaName}`);
      await this.sequelize.createSchema(schemaName, { logging: false });
      this.logger.info(`✅ Created schema: ${schemaName}`);

      this.logger.info(`Syncing tables for schema: ${schemaName}`);
      await User.schema(schemaName).sync({ force: false });
      await Consumer.schema(schemaName).sync({ force: false });
      await CustomField.schema(schemaName).sync({ force: false });
      await ConsumerCustomFieldValue.schema(schemaName).sync({ force: false });
      this.logger.info(`✅ Tables synced in schema: ${schemaName}`);

      // span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      this.logger.error({ err: error }, `❌ Failed to register new business schema: ${schemaName}`);
      // span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    }
  }
}
