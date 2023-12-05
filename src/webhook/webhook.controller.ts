import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CustomerSmartContractEventsDto } from '../dtos/webhook.dto';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhook: WebhookService) {}

    @Post()
    @ApiHeader({
        name: 'x-webhook-signature',
        description: 'Signature of the webhook: https://docs.parfin.io/#tag/Signature-Algorithm, EXAMPLE: 0a6cfcea4e0c2424e227648a0a153770a46e6995b61de7bf5424c1e9fb216175',
    })
    @HttpCode(200)
    @ApiOperation({ summary: 'Handle incoming webhook' })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid webhook signature.' })
    handleWebhook(@Body() payload: CustomerSmartContractEventsDto) {
        this.webhook.decodeEvent(payload);
        return {};
    }
}
