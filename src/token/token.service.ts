// real-digital-token.service.ts
import strABI from '../ABI/strABI.json';
import realDigitalABI from '../ABI/realDigitalABI.json';
import realDigitalDefaultAccountABI from '../ABI/realDigitalDefaultAccountABI.json';
import realTokenizadoABI from '../ABI/realTokenizadoABI.json';
import tpftABI from '../ABI/tpftABI.json';

import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';

import { BurnDTO, MintDTO, TransferDTO } from './dto/token-dto';
import { IService } from 'src/interfaces/service';
import { ContractHelper } from 'src/helpers/contract';
import { parfinCallData, parfinSendData } from 'src/parfin/mock';
import {
  ContractDTO,
  ContractSendDTO,
  ResponseDeployContractDTO,
} from 'src/shared-dtos/contract';
import { ParfinService } from 'src/parfin/parfin.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/create-transaction.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly contractHelper: ContractHelper,
    private readonly parfinService: ParfinService,
    private readonly transactionService: TransactionsService,
  ) {}

  // Função para emitir um ativo
  async mint({ contractId, dto }: IService): Promise<any> {
    const { asset, amount, to } = dto as MintDTO;
    if (asset === 'rd') {
      await this.contractHelper.setContract(strABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.requestToMint(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
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
    } else if (asset === 'rt') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.mint(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
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
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .contract.methods.mint(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );

      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.MINT,
        asset: AssetTypes.TPFT,
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

  // Função para resgatar um ativo
  async burn({ contractId, dto }: IService): Promise<any> {
    const { asset, amount } = dto as BurnDTO;
    if (asset === 'rd') {
      await this.contractHelper.setContract(strABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.requestToBurn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
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
    } else if (asset === 'rt') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      tpftABI;
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.burn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
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
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.burn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );

      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.BURN,
        asset: AssetTypes.TPFT,
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

  // Função para transferência de um ativo
  async transfer({ contractId, dto }: IService): Promise<any> {
    const { asset, cnpj, amount, to } = dto as TransferDTO;
    if (asset === 'rd') {
      await this.contractHelper.setContract(
        realDigitalDefaultAccountABI,
        contractId,
      );
      // Buscar o endereço da carteira do destinatário usando o CNPJ da instituição
      parfinCallData.metadata = this.contractHelper
        .getContract()
        .methods.defaultAccount(cnpj)
        .encodeABI();
      const { realDigitalDefaultAccounttransactionId } =
        await this.tokenRepository.smartContractCall(
          contractId,
          parfinCallData,
        );

      const transactionData = {
        parfinTransactionId: realDigitalDefaultAccounttransactionId,
        operation: TransactionOperations.TRANSFER,
        asset: AssetTypes.RT,
        ...parfinSendData,
      };
      const { id: dbTransactionId } = await this.transactionService.create(
        transactionData,
      );

      await this.transactionService.smartContractSignAndPush(
        realDigitalDefaultAccounttransactionId,
        dbTransactionId,
      );
      // Executar a transferência entre instituições distintas
      await this.contractHelper.setContract(realDigitalABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );

      transactionData.parfinTransactionId = transactionId;

      return await this.transactionService.smartContractSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'rt') {
      // Executar a transferência entre clientes da mesma instituição
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
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
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );

      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.TRANSFER,
        asset: AssetTypes.TPFT,
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

  async getAllContracts(): Promise<ContractDTO[]> {
    const allContracts = await this.tokenRepository.getAllContracts();
    return allContracts;
  }

  async smartContractSend(contractId: string, data: ContractSendDTO) {
    return await this.tokenRepository.smartContractSend(contractId, data);
  }
}
