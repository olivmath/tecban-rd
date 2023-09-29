import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract';
import { IService } from 'src/interfaces/service';
import realTokenizadoABI from '../ABI/realTokenizadoABI.json';
import realDigitalDefaultAccountABI from '../ABI/realDigitalDefaultAccountABI.json';

import { parfinCallData, parfinSendData } from 'src/parfin/mock';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/create-transaction.dto';
import { BurnDTO, MintDTO, TransferDTO } from 'src/token/dto/token-dto';
import {
  InteractionEnum,
  TransactionsService,
} from 'src/transactions/transactions.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class RealTokenizadoService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly tokenService: TokenService,
  ) {}

  async mint({ contractId, dto }: IService): Promise<any> {
    const { amount, to } = dto as MintDTO;
    await this.contractHelper.setContract(realTokenizadoABI, contractId);
    parfinSendData.metadata = this.contractHelper
      .getContract()
      .methods.mint(to, amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      parfinSendData,
    );

    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.MINT,
      asset: AssetTypes.RT,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    return await this.transactionService.smartContractSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }

  async burn({ contractId, dto }: IService): Promise<any> {
    const { amount } = dto as BurnDTO;
    await this.contractHelper.setContract(realTokenizadoABI, contractId);
    parfinSendData.metadata = this.contractHelper
      .getContract()
      .methods.burn(amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      parfinSendData,
    );

    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.BURN,
      asset: AssetTypes.RT,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    return await this.transactionService.smartContractSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }

  async transfer({ contractId, dto }: IService): Promise<any> {
    const { cnpj, amount, to } = dto as TransferDTO;
    // Executar a transferência entre clientes da mesma instituição
    await this.contractHelper.setContract(realTokenizadoABI, contractId);
    const data = this.contractHelper
      .getContract()
      .methods.transfer(to, amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      data,
    );

    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.TRANSFER,
      asset: AssetTypes.RT,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    return await this.transactionService.smartContractSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }
}
