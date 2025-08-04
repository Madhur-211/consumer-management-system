import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';
import { REQUEST } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectModel(CustomField) private customFieldModel: typeof CustomField,
    @InjectModel(ConsumerCustomFieldValue)
    private customFieldValueModel: typeof ConsumerCustomFieldValue,
    private readonly logger: PinoLogger,
    // @Inject(REQUEST) private readonly request: Request,
  ) {
    this.logger.setContext(CustomFieldsService.name);
  }

  // private get schema() {
  //   const s = this.request['schema'];
  //   console.log('Current tenant schema in ConsumersService:', s);
  //   return s;
  // }

  async createCustomField(data: any, schema: string) {
    this.logger.info({ schema, data }, 'Creating custom field');
    return this.customFieldModel.schema(schema).create(data);
  }

  async assignCustomFieldValues(values: any[], schema: string) {
    this.logger.info({ count: values.length, schema }, 'Assigning custom field values');
    return this.customFieldValueModel.schema(schema).bulkCreate(values);
  }

  async getConsumerFields(consumerId: string, schema: string) {
    this.logger.debug({ consumerId, schema }, 'Fetching consumer field values');
    return this.customFieldValueModel.schema(schema).findAll({
      where: { consumer_id: consumerId },
      include: [CustomField],
    });
  }
}

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/sequelize';
// import { CustomField } from '../models/custom-field.model';
// import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
// import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';

// @Injectable()
// export class CustomFieldsService {
//   constructor(
//     @InjectModel(CustomField)
//     private readonly customFieldModel: typeof CustomField,
//   ) {}

//   async create(dto: CreateCustomFieldDto) {
//     return this.customFieldModel.schema(this.schema).create(dto as any);
//   }

//   async findAll() {
//     return this.customFieldModel.schema(this.schema).findAll();
//   }

//   async findOne(id: string) {
//     const field = await this.customFieldModel.schema(this.schema).findByPk(id);
//     if (!field) throw new NotFoundException('Custom field not found');
//     return field;
//   }

//   async update(id: string, dto: UpdateCustomFieldDto) {
//     const field = await this.findOne(id);
//     return field.update(dto);
//   }

//   async remove(id: string) {
//     const field = await this.findOne(id);
//     await field.destroy();
//     return { message: 'Custom field deleted' };
//   }
// }
