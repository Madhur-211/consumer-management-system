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
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class ConsumersService {
  constructor(
    @InjectModel(Consumer)
    private consumerModel: typeof Consumer,
    @InjectPinoLogger(ConsumersService.name)
    private readonly logger: PinoLogger,
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
    this.logger.info({ userId, schema }, 'Creating new consumer');
    const result = await this.consumerModel.schema(schema).create({
      ...createConsumerDto,
      created_by: userId,
      updated_by: userId,
    } as any);
    this.logger.debug({ consumerId: result.consumer_id }, 'Consumer created');
    return result;
  }

  async findAll(schema: string) {
    this.logger.info({ schema }, 'Finding all consumers');
    return this.consumerModel.schema(schema).findAll({ paranoid: false });
  }

  async findOne(consumer_id: string, schema: string) {
    this.logger.info({ consumer_id, schema }, 'Finding one consumer');
    return this.consumerModel.schema(schema).findByPk(consumer_id);
  }

  async update(consumer_id: string, dto: Partial<CreateConsumerDto>, schema: string,) {
    this.logger.info({ consumer_id, schema }, 'Updating consumer');
    try {
      const result = await this.consumerModel.schema(schema).update(dto, {
        where: { consumer_id },
        returning: true,
      });
      this.logger.debug({ consumer_id, updated: result[0] }, 'Consumer updated');
      return result;
    } catch (error) {
      this.logger.error(error, 'Error updating consumer');
      throw error;
    }
  }

  async remove(id: string, schema: string,): Promise<number> {
    this.logger.warn({ id, schema }, 'Removing consumer');
    try {
      const result = await this.consumerModel
        .schema(schema)
        .destroy({ where: { consumer_id: id } });
      this.logger.debug({ id, result }, 'Consumer removed');
      return result;
    } catch (error) {
      this.logger.error(error, 'Error removing consumer');
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
    this.logger.info({ id, schema }, 'Toggling block status');
    const consumer = await this.consumerModel.schema(schema).findByPk(id);
    if (!consumer) throw new NotFoundException('Consumer not found');

    consumer.is_blocked = !consumer.is_blocked;
    await consumer.save();
    this.logger.debug({ id, blocked: consumer.is_blocked }, 'Block status updated');
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
    this.logger.info({ id, schema }, 'Toggling test consumer status');
    const consumer = await this.consumerModel.schema(schema).findByPk(id);
    if (!consumer) throw new NotFoundException('Consumer not found');

    consumer.is_test_consumer = !consumer.is_test_consumer;
    await consumer.save();
    this.logger.debug({ id, is_test_consumer: consumer.is_test_consumer }, 'Test consumer status updated');
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
