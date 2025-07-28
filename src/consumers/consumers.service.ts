import {
  flatten,
  Injectable,
  NotFoundException,
  Scope,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Consumer } from '../models/consumer.model';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

export class ConsumersService {
  constructor(
    @InjectModel(Consumer)
    private consumerModel: typeof Consumer,
    // @Inject(REQUEST) private readonly request: Request,
  ) {}
  
// private getModels(){
//     return  {"Consumer":Consumer.schema(this.schema),'jjd':jjd.schema(this.schema)}
// }
  
  // private get schema() {
  //   const s = this.request['schema'];
  //   console.log('Current tenant schema in ConsumersService:', s);
  //   return s;
  // }

  async create(
    createConsumerDto: CreateConsumerDto,
    userId: string,
    schema: string,
  ): Promise<Consumer> {
    // const {Consumer } =this.getModels()
    return await this.consumerModel.schema(schema).create({
      ...createConsumerDto,
      created_by: userId,
      updated_by: userId,
    } as any);
  }

  findAll(schema: string,) {
    return this.consumerModel.schema(schema).findAll({ paranoid: false });
  }

  findOne(consumer_id: string, schema: string,) {
    return this.consumerModel.schema(schema).findByPk(consumer_id);
  }

  async update(consumer_id: string, dto: Partial<CreateConsumerDto>, schema: string,) {
    try {
      return await this.consumerModel.schema(schema).update(dto, {
        where: { consumer_id },
        returning: true,
      });
    } catch (error) {
      console.error('Update Consumer Error:', error);
      throw error;
    }
  }

  async remove(id: string, schema: string,): Promise<number> {
    try {
      return await this.consumerModel
        .schema(schema)
        .destroy({ where: { consumer_id: id } });
    } catch (error) {
      console.error('Delete Consumer Error:', error);
      throw error;
    }
  }

  // async blockConsumer(id: string): Promise<Consumer> {
  //   const consumer = await this.consumerModel.schema(this.schema).findByPk(id);
  //   if (!consumer) throw new NotFoundException('Consumer not found');

  //   consumer.is_blocked = true;
  //   await consumer.save();
  //   return consumer;
  // }

  async blockUnblock(id: string, schema: string,): Promise<Consumer> {
    const consumer = await this.consumerModel.schema(schema).findByPk(id);
    if (!consumer) throw new NotFoundException('Consumer not found');
    if (consumer.is_blocked == true) {
      console.log(consumer.is_blocked);
      consumer.is_blocked = false;
    }
    else {
      consumer.is_blocked = true;
    }
    await consumer.save();
    return consumer;
  }

  // async unblockConsumer(id: string): Promise<Consumer> {
  //   const consumer = await this.consumerModel.schema(this.schema).findByPk(id);
  //   if (!consumer) throw new NotFoundException('Consumer not found');

  //   consumer.is_blocked = false;
  //   await consumer.save();
  //   return consumer;
  // }

  // async markAsTestConsumer(id: string): Promise<Consumer> {
  //   const consumer = await this.consumerModel.schema(this.schema).findByPk(id);
  //   if (!consumer) throw new NotFoundException('Consumer not found');

  //   consumer.is_test_consumer = true;
  //   await consumer.save();
  //   return consumer;
  // }

  async testConsumer(id: string, schema: string,): Promise<Consumer> {
    const consumer = await this.consumerModel.schema(schema).findByPk(id);
    if (!consumer) throw new NotFoundException('Consumer not found');

    if (consumer.is_test_consumer == true) {
      consumer.is_test_consumer = false;
    }
    else {
      consumer.is_test_consumer = true;
    }
    await consumer.save();
    return consumer;
  }

  // async unmarkAsTestConsumer(id: string): Promise<Consumer> {
  //   const consumer = await this.consumerModel.schema(this.schema).findByPk(id);
  //   if (!consumer) throw new NotFoundException('Consumer not found');

  //   consumer.is_test_consumer = false;
  //   await consumer.save();
  //   return consumer;
  // }
}
