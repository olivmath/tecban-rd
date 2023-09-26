import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract';
import { IService } from 'src/interfaces/service';
import strABI from '../ABI/strABI.json';
import realDigitalABI from '../ABI/realDigitalABI.json';
import realDigitalDefaultAccountABI from '../ABI/realDigitalDefaultAccountABI.json';

import { parfinCallData, parfinSendData } from 'src/parfin/mock';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/create-transaction.dto';
import { MintDTO, TransferDTO } from 'src/token/dto/token-dto';
import {
  InteractionEnum,
  TransactionsService,
} from 'src/transactions/transactions.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class RealDigitalService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly tokenService: TokenService,
  ) {}

  async mint({ contractId, dto }: IService): Promise<any> {
    const { amount } = dto as MintDTO;
    await this.contractHelper.setContract(
      strABI,
      parfinSendData.metadata.contractAddress,
    );
    parfinSendData.metadata = this.contractHelper
      .getContract()
      .methods.requestToMint(amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      parfinSendData,
    );

    //salvar no banco
    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.MINT,
      asset: AssetTypes.RD,
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
    const { amount } = dto;
    await this.contractHelper.setContract(
      strABI,
      parfinSendData.metadata.contractAddress,
    );
    parfinSendData.metadata = this.contractHelper
      .getContract()
      .methods.requestToBurn(amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      parfinSendData,
    );

    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.BURN,
      asset: AssetTypes.RD,
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

    await this.contractHelper.setContract(
      realDigitalDefaultAccountABI,
      parfinSendData.metadata.contractAddress,
    );
    // Buscar o endereço da carteira do destinatário usando o CNPJ da instituição
    parfinCallData.metadata = this.contractHelper
      .getContract()
      .methods.defaultAccount(cnpj)
      .encodeABI();
    const { realDigitalDefaultAccounttransactionId } =
      await this.tokenService.smartContractCall(contractId, parfinCallData);

    const transactionData = {
      parfinTransactionId: realDigitalDefaultAccounttransactionId,
      operation: TransactionOperations.TRANSFER,
      asset: AssetTypes.RD,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    await this.transactionService.smartContractSignAndPush(
      realDigitalDefaultAccounttransactionId,
      dbTransactionId,
      InteractionEnum.CALL,
    );
    // Executar a transferência entre instituições distintas
    await this.contractHelper.setContract(
      realDigitalABI,
      parfinSendData.metadata.contractAddress,
    );
    const data = this.contractHelper
      .getContract()
      .methods.transfer(to, amount)
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      data,
    );

    transactionData.parfinTransactionId = transactionId;

    return await this.transactionService.smartContractSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }
}
