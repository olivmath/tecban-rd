export class EventDto {
    removed: boolean;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
    data: string;
    topics: string[];
    logIndexRaw: string;
    transactionIndexRaw: string;
    blockNumberRaw: string;
}
