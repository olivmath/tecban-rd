import { Injectable } from '@nestjs/common';

type OperationId = {
    index: string;
    bankCode: string;
    date: string;
    toString: () => string;
};

@Injectable()
export class OperationIdService {
    private sequenceNumber = 1;

    newOpId(): OperationId {
        const formattedSequence = this.sequenceNumber.toString().padStart(5, '0');
        const bankCode = '37';
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
        
        this.sequenceNumber++;
        return {
            index: formattedSequence,
            bankCode: bankCode,
            date: formattedDate,
            toString: function () {
                return `${this.index}${this.bankCode}${this.date}`;
            },
        };
    }
}
