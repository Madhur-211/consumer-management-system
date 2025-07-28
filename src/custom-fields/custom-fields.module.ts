import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';
import { CustomFieldsService } from './custom-fields.service';
import { CustomFieldsController } from './custom-fields.controller';

@Module({
  imports: [SequelizeModule.forFeature([CustomField, ConsumerCustomFieldValue])],
  providers: [CustomFieldsService],
  controllers: [CustomFieldsController],
  exports: [CustomFieldsService],
})
export class CustomFieldsModule {}


// import { Module } from '@nestjs/common';
// import { SequelizeModule } from '@nestjs/sequelize';
// import { CustomField } from '../models/custom-field.model';
// import { CustomFieldsService } from './custom-fields.service';
// import { CustomFieldsController } from './custom-fields.controller';

// @Module({
//   imports: [SequelizeModule.forFeature([CustomField])],
//   providers: [CustomFieldsService],
//   controllers: [CustomFieldsController],
//   exports: [CustomFieldsService],
// })
// export class CustomFieldsModule {}
