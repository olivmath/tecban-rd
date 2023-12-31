import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { LoggerService } from 'src/logger/logger.service';
import { WebhookService } from './webhook.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { ParfinModule } from 'src/parfin/parfin.module';

@Module({
    imports: [ParfinModule],
    controllers: [WebhookController],
    providers: [LoggerService, WebhookService, ContractHelperService],
    exports: [WebhookService],
})
export class WebhookModule {}
