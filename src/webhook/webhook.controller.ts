import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomerSmartContractEventsDto } from '../dtos/webhook.dto';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhook: WebhookService) {}

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Handle incoming webhook' })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid webhook signature.' })
    handleWebhook(@Body() payload: CustomerSmartContractEventsDto): any {
        return this.webhook.decodeEvent(payload)
    }
}
