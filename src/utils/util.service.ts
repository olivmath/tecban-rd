import { Injectable } from '@nestjs/common';

type OperationId = {
    index: string;
    bankCode: string;
    date: string;
    toString: () => string;
};

@Injectable()
export class UtilsService {
    private sequenceNumber = 1;

    generateOperationId(): OperationId {
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

    getTradeTotal(tpftAmount: string, unitPrice: number) {
        const amount = parseFloat(tpftAmount) / 100;
        const formattedAmount = amount.toFixed(2);

        const total = (Number(formattedAmount) * unitPrice).toFixed(2);

        const formattedTotal = total.toString().replace('.', '');

        return { total, formattedTotal };

    }
}