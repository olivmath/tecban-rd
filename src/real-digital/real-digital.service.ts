import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract';
import { IService } from 'src/interfaces/service';
import strABI from '../ABI/STR.abi.json';
import realDigitalABI from '../ABI/RealDigital.abi.json';
import realDigitalDefaultAccountABI from '../ABI/RealDigitalDefaultAccount.abi.json';

import { parfinCallData, parfinSendData } from 'src/parfin/parfin.body';

import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/transaction.dto';
import {
  RealDigitalMintDTO,
  RealDigitalBurnDTO,
  RealDigitalTransferDTO
} from './dtos/real-digital.dto';
import {
  InteractionEnum,
  TransactionsService,
} from 'src/transactions/transactions.service';
import { ParfinService } from 'src/parfin/parfin.service';

// TODO: verificar a necessidade do 'await' antes do 'this

@Injectable()
export class RealDigitalService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly parfinService: ParfinService,
  ) { }

  async mint({ contractId, dto }: IService): Promise<any> {
    const { amount } = dto as RealDigitalMintDTO;

    // 1 - Criar instância do contrato
    await this.contractHelper.setContract(
      strABI,
      contractId,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendData.metadata.data = this.contractHelper
      .getContract()
      .methods.requestToMint(amount)
      .encodeABI();

    // 3 - Interagir com o contrato usando o endpoint send/write
    const { id: transactionId } = await this.parfinService.smartContractSend(
      contractId,
      parfinSendData,
    );

    // 4 - Salvar transação no banco
    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.MINT,
      asset: AssetTypes.RD,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    // 5 - Assinar transação e inserir na blockchain
    return await this.transactionService.transactionSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }

  async burn({ contractId, dto }: IService): Promise<any> {
    const { amount } = dto as RealDigitalBurnDTO;

    // 1 - Criar instância do contrato
    await this.contractHelper.setContract(
      strABI,
      parfinSendData.metadata.contractAddress,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendData.metadata.data = this.contractHelper
      .getContract()
      .methods.requestToBurn(amount)
      .encodeABI();

    // 3 - Interagir com o contrato usando o endpoint send/write
    const { id: transactionId } = await this.parfinService.smartContractSend(
      contractId,
      parfinSendData,
    );

    // 4 - Salvar transação no banco
    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.BURN,
      asset: AssetTypes.RD,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    // 5 - Assinar transação e inserir na blockchain
    return await this.transactionService.transactionSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }

  async transfer({ contractId, dto }: IService): Promise<any> {
    const { cnpj, amount } = dto as RealDigitalTransferDTO;

    //TODO: Refatorar a criação de todos os metadata.data

    // 1 - Buscar carteira do destinatário usando o CNPJ da insituição

    // 1.1 - Buscar endereço do contrato RealDigitalDefaulAccount.sol
    // TODO: Implementar funcionalidade de buscar o endereço de um contrato
    const realDigitalDefaultAccountAddress = '';

    // 1.2 - Criar instância do contrato
    await this.contractHelper.setContract(
      realDigitalDefaultAccountABI,
      realDigitalDefaultAccountAddress,
    );

    // 1.3 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinCallData.metadata.data = this.contractHelper
      .getContract()
      .methods.defaultAccount(cnpj)
      .encodeABI();

    // 1.4 - Interagir com o contrato usando o endpoint call/read
    const { data } = await this.parfinService.smartContractCall(contractId, parfinCallData);

    // 1.5 - Recuperar o CNPJ das informações consultdas no contrato
    const receiverAddress = '';

    // 2 - Executar a transferência

    // 2.1 - Criar instância do contrato
    await this.contractHelper.setContract(
      realDigitalABI,
      contractId,
    );

    // 2.2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendData.metadata.data = this.contractHelper
      .getContract()
      .methods.transfer(receiverAddress, amount)
      .encodeABI();

    // 2.3 - Interagir com o contrato usando o endpoint send/write
    const { id: transactionId } = await this.parfinService.smartContractSend(
      contractId,
      parfinSendData,
    );

    // 2.4 - Salvar transação no banco
    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.TRANSFER,
      asset: AssetTypes.RD,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );
    // 2.5 - Assinar transação e inserir na blockchain
    return await this.transactionService.transactionSignAndPush(
      transactionId,
      dbTransactionId,
    );
  }
}
