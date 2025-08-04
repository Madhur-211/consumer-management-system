import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsumersService } from './consumers.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
// import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Schema } from '../common/decorators/schema.decorator';
import { PinoLogger } from 'nestjs-pino';

@ApiTags('consumers')
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService,
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async create(
    @Body() createConsumerDto: CreateConsumerDto,
    @CurrentUser() user: any,
    @Schema() schema : any,
  ) {
    try {
      const result = await this.consumersService.create(createConsumerDto, user.id, schema);
      this.logger.info({ event: 'consumer_created', result });
      return result;
    } catch (error) {
      this.logger.error({ event: 'consumer_create_failed', error });
      throw new HttpException('Failed to create consumer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(@Schema() schema : any,) {
    try {
      const consumers = await this.consumersService.findAll(schema);
      this.logger.info({ event: 'consumers_fetched', count: consumers.length });
      return consumers;
    } catch (error) {
      this.logger.error({ event: 'consumers_fetch_failed', error });
      throw new HttpException('Failed to fetch consumers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Schema() schema: any) {
    try {
      const consumer = await this.consumersService.findOne(id, schema);
      this.logger.info({ event: 'consumer_fetched', id });
      return consumer;
    } catch (error) {
      this.logger.error({ event: 'consumer_fetch_failed', id, error });
      throw new HttpException('Failed to fetch consumer', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateConsumerDto,
    @CurrentUser() user: any,
    @Schema() schema: any,
  ) {
    try {
      const updated = await this.consumersService.update(
        id,
        { ...dto, updated_by: user.id },
        schema,
      );
      this.logger.info({ event: 'consumer_updated', id });
      return updated;
    } catch (error) {
      this.logger.error({ event: 'consumer_update_failed', id, error });
      throw new HttpException('Failed to update consumer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Schema() schema: any) {
    try {
      const removed = await this.consumersService.remove(id, schema);
      this.logger.info({ event: 'consumer_deleted', id });
      return removed;
    } catch (error) {
      this.logger.error({ event: 'consumer_delete_failed', id, error });
      throw new HttpException('Failed to delete consumer', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch(':id/block')
  // @ApiOperation({ summary: 'Block a consumer' })
  // blockConsumer(@Param('id') id: string) {
  //   return this.consumersService.blockConsumer(id);
  // }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Change in block status' })
  async blockUnblock(@Param('id') id: string, @Schema() schema: any) {
    try {
      const result = await this.consumersService.blockUnblock(id, schema);
      this.logger.info({ event: 'consumer_block_toggled', id });
      return result;
    } catch (error) {
      this.logger.error({ event: 'consumer_block_toggle_failed', id, error });
      throw new HttpException('Failed to toggle block status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch(':id/unblock')
  // @ApiOperation({ summary: 'Unblock a consumer' })
  // unblockConsumer(@Param('id') id: string) {
  //   return this.consumersService.unblockConsumer(id);
  // }

  // @Patch(':id/mark-test')
  // @ApiOperation({ summary: 'Mark consumer as test consumer' })
  // markAsTest(@Param('id') id: string) {
  //   return this.consumersService.markAsTestConsumer(id);
  // }

  @Patch(':id/test')
  @ApiOperation({ summary: 'Change in Test Consumer status' })
  async testConsumer(@Param('id') id: string, @Schema() schema: any) {
    try {
      const result = await this.consumersService.testConsumer(id, schema);
      this.logger.info({ event: 'consumer_test_status_toggled', id });
      return result;
    } catch (error) {
      this.logger.error({ event: 'consumer_test_toggle_failed', id, error });
      throw new HttpException('Failed to toggle test status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch(':id/unmark-test')
  // @ApiOperation({ summary: 'Unmark test consumer' })
  // unmarkTest(@Param('id') id: string) {
  //   return this.consumersService.unmarkAsTestConsumer(id);
  // }
}
