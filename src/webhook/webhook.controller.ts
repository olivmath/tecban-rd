import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomerSmartContractEventsDto } from './dto/customer-smart-contract-events.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  @Post()
  @ApiOperation({ summary: 'Handle incoming webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid webhook signature.' })
  handleWebhook(@Body() payload: CustomerSmartContractEventsDto): string {
    return 'Webhook received';
  }
}
