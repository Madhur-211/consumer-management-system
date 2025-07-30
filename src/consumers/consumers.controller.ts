import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsumersService } from './consumers.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Schema } from '../common/decorators/schema.decorator';

@ApiTags('consumers')
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  @Post()
  async create(
    @Body() createConsumerDto: CreateConsumerDto,
    @CurrentUser() user: any,
    @Schema() schema : any,
  ) {
    console.log('User inside controller:', user);
    return this.consumersService.create(createConsumerDto, user.id, schema);
  }

  @Get()
  findAll(@Schema() schema : any,) {
    return this.consumersService.findAll(schema);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Schema() schema : any,) {
    return this.consumersService.findOne(id, schema);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateConsumerDto,
    @CurrentUser() user: any,
    @Schema() schema : any,
  ) {
    return this.consumersService.update(id, {
      ...updateDto,
      updated_by: user.id,
    }, schema);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Schema() schema : any,) {
    return this.consumersService.remove(id, schema);
  }

  // @Patch(':id/block')
  // @ApiOperation({ summary: 'Block a consumer' })
  // blockConsumer(@Param('id') id: string) {
  //   return this.consumersService.blockConsumer(id);
  // }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Change in block status' })
  blockUnblock(@Param('id') id: string, @Schema() schema : any,) {
    return this.consumersService.blockUnblock(id, schema);
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
  testConsumer(@Param('id') id: string, @Schema() schema : any,) {
    return this.consumersService.testConsumer(id, schema);
  }

  // @Patch(':id/unmark-test')
  // @ApiOperation({ summary: 'Unmark test consumer' })
  // unmarkTest(@Param('id') id: string) {
  //   return this.consumersService.unmarkAsTestConsumer(id);
  // }
}
