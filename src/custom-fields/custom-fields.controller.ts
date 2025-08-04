import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Schema } from '../common/decorators/schema.decorator';
import { PinoLogger } from 'nestjs-pino';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService,
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  async createField(@Body() body: any, @CurrentUser() user: any, @Schema() schema: any,) {
    try {
      const userId = user.id;
      const payload = {
        ...body,
        created_by: userId,
        updated_by: userId,
      };
      const result = await this.customFieldsService.createCustomField(payload, schema);
      this.logger.info({ event: 'custom_field_created', payload });
      return result;
    } catch (error) {
      this.logger.error({ event: 'custom_field_create_failed', error });
      throw new HttpException('Failed to create custom field', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('consumer/:id/values')
  async assignValuesToConsumer(
    @Param('id') consumerId: string,
    @Body() values: { custom_field_id: string; value: string }[],
    @CurrentUser() user: any,
    @Schema() schema: any,
  ) {
    try {
      const userId = user.id;
      const prepared = values.map((val) => ({
        ...val,
        consumer_id: consumerId,
        created_by: userId,
        updated_by: userId,
      }));

      const result = await this.customFieldsService.assignCustomFieldValues(prepared, schema);
      this.logger.info({ event: 'custom_field_values_assigned', consumerId, count: values.length });
      return result;
    } catch (error) {
      this.logger.error({ event: 'assign_custom_field_values_failed', consumerId, error });
      throw new HttpException('Failed to assign field values', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('consumer/:id/values')
  async getConsumerFieldValues(@Param('id') consumerId: string, @Schema() schema: any,) {
    try {
      const values = await this.customFieldsService.getConsumerFields(consumerId, schema);
      this.logger.info({ event: 'custom_field_values_fetched', consumerId, count: values.length });
      return values;
    } catch (error) {
      this.logger.error({ event: 'get_custom_field_values_failed', consumerId, error });
      throw new HttpException('Failed to get field values', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { CustomFieldsService } from './custom-fields.service';
// import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
// import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
// @Controller('custom-fields')
// export class CustomFieldsController {
//   constructor(private readonly customFieldsService: CustomFieldsService) {}

//   @Post()
//   create(@Body() dto: CreateCustomFieldDto) {
//     return this.customFieldsService.create(dto);
//   }

//   @Get()
//   findAll() {
//     return this.customFieldsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.customFieldsService.findOne(id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() dto: UpdateCustomFieldDto) {
//     return this.customFieldsService.update(id, dto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.customFieldsService.remove(id);
//   }
// }
