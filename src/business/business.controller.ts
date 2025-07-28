import { Controller, Post, Body } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('register')
  async registerBusiness(@Body() body: { schemaName: string }) {
    await this.businessService.registerNewBusiness(body.schemaName);
    return { message: `✅ Business "${body.schemaName}" registered successfully.` };
  }
}
