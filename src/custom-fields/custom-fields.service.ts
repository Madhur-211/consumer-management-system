import { Injectable, Scope, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CustomField } from '../models/custom-field.model';
import { ConsumerCustomFieldValue } from '../models/consumer-custom-field-value.model';
import { REQUEST } from '@nestjs/core';

// @Injectable({ scope: Scope.REQUEST })
export class CustomFieldsService {
  constructor(
    @InjectModel(CustomField) private customFieldModel: typeof CustomField,
    @InjectModel(ConsumerCustomFieldValue)
    private customFieldValueModel: typeof ConsumerCustomFieldValue,
    // @Inject(REQUEST) private readonly request: Request,
  ) {}

  // private get schema() {
  //   const s = this.request['schema'];
  //   console.log('Current tenant schema in ConsumersService:', s);
  //   return s;
  // }

  async createCustomField(data: any, schema: string) {
    console.log('Creating custom field with:', data);
    return this.customFieldModel.schema(schema).create(data);
  }

  async assignCustomFieldValues(values: any[], schema: string) {
    return this.customFieldValueModel.schema(schema).bulkCreate(values);
  }

  async getConsumerFields(consumerId: string, schema: string) {
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
