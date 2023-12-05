import { Injectable } from '@nestjs/common';
import { CustomerSmartContractEventsDto } from 'src/dtos/webhook.dto';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class WebhookService {
    constructor(private readonly logger: LoggerService, private readonly contractHelper: ContractHelperService) {
        this.logger.setContext('WebhookService');
    }

    async decodeEvent(payload: CustomerSmartContractEventsDto) {
        this.logger.log('✅ New event');
        const event = payload.Event;
        try {
            const name = this.contractHelper.getContractNameByAddress(event.address);
            const contract = this.contractHelper.getContractMethods(name);
            const decoded = contract[event.topics[0]](event.topics.slice(1), event.data);
            this.logger.log(decoded);
        } catch (error) {
            this.logger.log(error);
        }
    }
}
