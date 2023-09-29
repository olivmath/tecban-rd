import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract';
import { IService } from 'src/interfaces/service';
import realTokenizadoABI from '../ABI/RealTokenizado.abi.json';
import keyDictionaryABI from '../ABI/KeyDictionary.abi.json';


import { parfinCallData, parfinSendData } from 'src/parfin/parfin.body';

import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/transaction.dto';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoTransferDTO
} from './dtos/real-tokenizado.dto';
import {
  InteractionEnum,
  TransactionsService,
} from 'src/transactions/transactions.service';
import { ParfinService } from 'src/parfin/parfin.service';

// TODO: verificar a necessidade do 'await' antes do 'this

@Injectable()
export class RealTokenizadoService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly parfinService: ParfinService,
  ) { }

  async mint({ contractId, dto }: IService): Promise<any> {
    const { to, amount } = dto as RealTokenizadoMintDTO;

    // 1 - Criar instância do contrato
    await this.contractHelper.setContract(
      realTokenizadoABI,
      contractId,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendData.metadata.data = this.contractHelper
      .getContract()
      .methods.requestToMint(to, amount)
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
    const { amount } = dto as RealTokenizadoBurnDTO;

    // 1 - Criar instância do contrato
    await this.contractHelper.setContract(
      realTokenizadoABI,
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
    const { key, amount } = dto as RealTokenizadoTransferDTO;

    //TODO: Refatorar a criação de todos os metadata.data

    // 1 - Buscar carteira do destinatário usando o CPF do cliente da instituição

    // 1.1 - Buscar endereço do contrato KeyDictionary.sol
    // TODO: Implementar funcionalidade de buscar o endereço de um contrato
    const keyDictionaryAddress = '';

    // 1.2 - Criar instância do contrato KeyDictionary.sol
    await this.contractHelper.setContract(
      keyDictionaryABI,
      keyDictionaryAddress,
    );

    // 1.3 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinCallData.metadata.data = this.contractHelper
      .getContract()
      .methods.getWallet(key)
      .encodeABI();

    // 1.4 - Interagir com o contrato usando o endpoint call/read
    const { data } = await this.parfinService.smartContractCall(contractId, parfinCallData);

    // 1.5 - Recuperar o CPF das informações consultdas no contrato
    const receiverAddress = '';

    // 2 - Executar a transferência

    // 2.1 - Criar instância do contrato RealTokenizado.sol
    await this.contractHelper.setContract(
      realTokenizadoABI,
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
