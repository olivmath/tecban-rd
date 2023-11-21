import { ApiProperty } from '@nestjs/swagger';
import { EventDto } from 'src/types/webhook.types';

export class CustomerSmartContractEventsDto {
    @ApiProperty({ description: 'Unique identifier of the event' })
    Id: string;

    @ApiProperty({ description: 'Customer ID' })
    CustomerId: string;

    @ApiProperty({ description: 'Creation date of the event' })
    CreatedAt: string;

    @ApiProperty({ description: 'Name of the event', type: EventDto })
    Event: EventDto;

    @ApiProperty({ description: 'Blockchain identifier' })
    BlockchainId: string;

    @ApiProperty({ description: 'Last time the event was updated' })
    LastTimeUpdated: string;

    @ApiProperty({ description: 'Log index as a string' })
    LogIndex: string;

    @ApiProperty({ description: 'Trace key for the event' })
    TraceKey: string;

    @ApiProperty({ description: 'Smart contract address' })
    SmartContract: string;

    @ApiProperty({ description: 'Transaction hash associated with the event' })
    TransactionHash: string;
}
