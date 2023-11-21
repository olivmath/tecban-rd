import { Injectable } from '@nestjs/common';
import { CustomerSmartContractEventsDto } from 'src/dtos/webhook.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class WebhookService {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('WebhookService');
    }

    decodeEvent(payload: CustomerSmartContractEventsDto): any {
        this.logger.log(payload)
        return {
            eventName: 'Mint',
            from: '0x0000000000000000000000000000000000000000',
            to: '0xe6443CF5f789161aBF1e899D93CE2be086Cef40a',
            value: '1000',
        };
    }
}
