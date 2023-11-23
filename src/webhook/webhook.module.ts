import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookValidationMiddleware } from 'src/middleware/webhook-validation.middleware';
import { LoggerService } from 'src/logger/logger.service';
import { WebhookService } from './webhook.service';

@Module({
    controllers: [WebhookController],
    providers: [LoggerService, WebhookService],
    exports: [WebhookService],
})
export class WebhookModule {}
