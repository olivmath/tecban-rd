import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookValidationMiddleware } from 'src/middleware/webhook-validation.middleware';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    controllers: [WebhookController],
    providers: [LoggerService]
})
export class WebhookModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(WebhookValidationMiddleware).forRoutes("*");
    }
}
