import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConsumersService } from './consumers.service';
import { ConsumersController } from './consumers.controller';
import { Consumer } from '../models/consumer.model';

@Module({
  imports: [SequelizeModule.forFeature([Consumer])],
  providers: [ConsumersService],
  controllers: [ConsumersController],
})
export class ConsumersModule {}
