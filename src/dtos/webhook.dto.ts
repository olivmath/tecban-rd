import { ApiProperty } from '@nestjs/swagger';
import { ArrayContains, ArrayNotEmpty, IsArray, IsBoolean, IsNumber, IsObject, IsString, isString } from 'class-validator';

export class EventData {
    @ApiProperty({ description: 'removed' })
    @IsBoolean()
    removed: boolean;

    @ApiProperty({ description: 'logIndex' })
    @IsNumber()
    logIndex: number;

    @ApiProperty({ description: 'transactionIndex' })
    @IsNumber()
    transactionIndex: number;

    @ApiProperty({ description: 'transactionHash' })
    @IsString()
    transactionHash: string;

    @ApiProperty({ description: 'blockHash' })
    @IsString()
    blockHash: string;

    @ApiProperty({ description: 'blockNumber' })
    @IsNumber()
    blockNumber: number;

    @ApiProperty({ description: 'address' })
    @IsString()
    address: string;

    @ApiProperty({ description: 'data' })
    @IsString()
    data: string;

    @ApiProperty({ description: 'topics' })
    @ArrayNotEmpty()
    @ArrayContains(["string"])
    topics: string[];

    @ApiProperty({ description: 'logIndexRaw' })
    @IsString()
    logIndexRaw: string;

    @ApiProperty({ description: 'transactionIndexRaw' })
    @IsString()
    transactionIndexRaw: string;

    @ApiProperty({ description: 'blockNumberRaw' })
    @IsString()
    blockNumberRaw: string;
}

export class CustomerSmartContractEventsDto {
    @ApiProperty({ description: 'Unique identifier of the event' })
    @IsString()
    Id: string;

    @ApiProperty({ description: 'Customer ID' })
    @IsString()
    CustomerId: string;

    @ApiProperty({ description: 'Creation date of the event' })
    @IsString()
    CreatedAt: string;

    @ApiProperty({ description: 'Name of the event', type: EventData })
    @IsObject()
    Event: EventData;

    @ApiProperty({ description: 'Blockchain identifier' })
    @IsString()
    BlockchainId: string;

    @ApiProperty({ description: 'Last time the event was updated' })
    @IsString()
    LastTimeUpdated: string;

    @ApiProperty({ description: 'Log index as a string' })
    @IsString()
    LogIndex: string;

    @ApiProperty({ description: 'Trace key for the event' })
    @IsString()
    TraceKey: string;

    @ApiProperty({ description: 'Smart contract address' })
    @IsString()
    SmartContract: string;

    @ApiProperty({ description: 'Transaction hash associated with the event' })
    @IsString()
    TransactionHash: string;
}
