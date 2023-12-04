import { Injectable } from '@nestjs/common';
import { TpftAcronym, TpftCode, TpftMaturityDate, TpftUnitPrice } from 'src/types/tpft.types';
import { OperationId, TPFtInfo } from 'src/types/utils.types';

@Injectable()
export class UtilsService {

    generateOperationId(): OperationId {
        const min = 1; // Minimum 4-digit number
        const max = 9999; // Maximum 4-digit number

        const random4DigitNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        const formattedSequence = random4DigitNumber.toString().padStart(4, '0');
        const bankCode = '37';
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, '');

        return {
            index: formattedSequence,
            bankCode: bankCode,
            date: formattedDate,
            toString: function () {
                const operationId = `${this.index}${this.bankCode}${this.date}`;
                return operationId;
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

    setTpftInfo(tpftSymbol: string): TPFtInfo {
        let acronym: TpftAcronym;
        let code: TpftCode;
        let maturityDate: TpftMaturityDate;
        let unitPrice: TpftUnitPrice;
        let floatUnitPrice: number;
        switch (tpftSymbol) {
            case 'LTN':
                acronym = TpftAcronym.LTN;
                code = TpftCode.LTN;
                maturityDate = TpftMaturityDate.LTN;
                unitPrice = TpftUnitPrice.LTN;
                floatUnitPrice = 986.40997100;
                break;
            case 'LFT':
                acronym = TpftAcronym.LFT;
                code = TpftCode.LFT;
                maturityDate = TpftMaturityDate.LFT;
                unitPrice = TpftUnitPrice.LFT;
                floatUnitPrice = 985.40997100;
                break;
        }

        return {
            acronym,
            code,
            maturityDate,
            unitPrice,
            floatUnitPrice,
        };
    }
}