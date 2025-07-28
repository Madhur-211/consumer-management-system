import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Consumer } from '../models/consumer.model';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';
import { User } from '../models/user.model';

@Injectable()
export class BusinessService {
  constructor(private readonly sequelize: Sequelize) {}

  async registerNewBusiness(schemaName: string) {
    await this.sequelize.createSchema(schemaName, { logging: false });
    console.log(`✅ Created schema: ${schemaName}`);

    await User.schema(schemaName).sync({ force: false });
    await Consumer.schema(schemaName).sync({ force: false });
    await CustomField.schema(schemaName).sync({ force: false });
    await ConsumerCustomFieldValue.schema(schemaName).sync({ force: false });

    console.log(`✅ Tables synced in schema: ${schemaName}`);
  }
}
