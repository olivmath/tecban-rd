import tpftABI from '../ABI/tpftABI.json';

import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';

import { BurnDTO, MintDTO, TransferDTO } from './dto/token-dto';
import { IService } from 'src/interfaces/service';
import { ContractHelper } from 'src/helpers/contract';
import { parfinSendData } from 'src/parfin/mock';
import {
  ContractCallDTO,
  ContractDTO,
  ContractSendDTO,
} from 'src/shared-dtos/contract';
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
    private readonly transactionService: TransactionsService,
  ) {}

  // Função para emitir um ativo
  async mint({ contractId, dto }: IService): Promise<any> {
    const { asset, amount, to } = dto as MintDTO;
    if (asset === 'tpft') {
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
    if (asset === 'tpft') {
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
    const { asset, amount, to } = dto as TransferDTO;
    if (asset === 'tpft') {
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

  async smartContractCall(contractId, data: ContractCallDTO) {
    return await this.tokenRepository.smartContractCall(contractId, data);
  }
}
