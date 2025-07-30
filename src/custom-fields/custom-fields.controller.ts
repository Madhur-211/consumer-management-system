import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Schema } from '../common/decorators/schema.decorator';

@Controller('custom-fields')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Post()
  async createField(@Body() body: any, @CurrentUser() user: any, @Schema() schema: any,) {
    const userId = user.id;
    const payload = {
      ...body,
      created_by: userId,
      updated_by: userId,
    };
    console.log('Payload:', payload);
    return this.customFieldsService.createCustomField(payload, schema);
  }

  @Post('consumer/:id/values')
  async assignValuesToConsumer(
    @Param('id') consumerId: string,
    @Body() values: { custom_field_id: string; value: string }[],
    @CurrentUser() user: any,
    @Schema() schema: any,
  ) {
    const userId = user.id;
    const prepared = values.map((val) => ({
      ...val,
      consumer_id: consumerId,
      created_by: userId,
      updated_by: userId,
    }));

    return this.customFieldsService.assignCustomFieldValues(prepared, schema);
  }

  @Get('consumer/:id/values')
  async getConsumerFieldValues(@Param('id') consumerId: string, @Schema() schema: any,) {
    return this.customFieldsService.getConsumerFields(consumerId, schema);
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
