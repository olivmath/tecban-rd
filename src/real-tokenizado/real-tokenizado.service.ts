import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract';
import { IServiceDTO } from 'src/interfaces/service';
import realTokenizadoABI from '../ABI/RealTokenizado.abi.json';
import keyDictionaryABI from '../ABI/KeyDictionary.abi.json';

import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/types/transactions.types';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoInternalTransferDTO
} from './dtos/real-tokenizado.dto';
import {
  TransactionsService,
} from 'src/transactions/transactions.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinContractCallSuccessRes, ParfinSuccessRes } from 'src/res/parfin.responses';

// TODO: verificar a necessidade do 'await' antes do 'this

@Injectable()
export class RealTokenizadoService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly parfinService: ParfinService,
  ) { }

  async mint({ dto }: IServiceDTO): Promise<any> {
    const { to, amount } = dto as RealTokenizadoMintDTO;
    const parfinSendDTO = dto as Omit<RealTokenizadoMintDTO, 'to' | 'amount' | 'blockchainId' | 'callMetadata'>;
    const { contractAddress } = parfinSendDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

    // 1 - Criar instância do contrato
    this.contractHelper.setContract(
      realTokenizadoABI,
      contractAddress,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendDTO.sendMetadata.data = this.contractHelper
      .getContract()
      .methods.requestToMint(to, amount)
      .encodeABI();

    try {
      // 3 - Interagir com o contrato usando o endpoint send/write
      const parfinSendRes = await this.parfinService.smartContractSend(
        parfinSendDTO
      );
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      if (transactionId) {
        try {
          // 4 - Salvar transação no banco
          const transactionData = {
            parfinTransactionId: transactionId,
            operation: TransactionOperations.MINT,
            asset: AssetTypes.RD,
            ...parfinSendDTO,
          };
          const { id: dbTransactionId } = await this.transactionService.create(
            transactionData,
          );

          if (dbTransactionId) {
            try {
              // 5 - Assinar transação e inserir na blockchain
              return await this.transactionService.transactionSignAndPush(
                transactionId,
                dbTransactionId,
              );
            } catch (error) {
              throw new Error(
                `Erro ao tentar assinar transação ${transactionId} de emissão de Real Tokenizado / Erro: ${error}`
              );
            }
          }
        } catch (error) {
          throw new Error(
            `Erro ao tentar salvar transação ${transactionId} de emissão de Real Tokenizado no banco / Erro: ${error}`
          );
        }
      }
    } catch (error) {
      throw new Error(`Erro ao tentar criar transação de emissão de Real Tokenizado / Erro: ${error}`);
    }
  }

  async burn({ dto }: IServiceDTO): Promise<any> {
    const { amount } = dto as RealTokenizadoBurnDTO;
    const parfinSendDTO = dto as Omit<RealTokenizadoBurnDTO, 'amount' | 'blockchainId' | 'callMetadata'>;
    const { contractAddress } = parfinSendDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

    // 1 - Criar instância do contrato
    this.contractHelper.setContract(
      realTokenizadoABI,
      contractAddress,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinSendDTO.sendMetadata.data = this.contractHelper
      .getContract()
      .methods.requestToBurn(amount)
      .encodeABI();

    try {
      // 3 - Interagir com o contrato usando o endpoint send/write
      const parfinSendRes = await this.parfinService.smartContractSend(
        parfinSendDTO,
      );
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      if (transactionId) {
        try {
          // 4 - Salvar transação no banco
          const transactionData = {
            parfinTransactionId: transactionId,
            operation: TransactionOperations.BURN,
            asset: AssetTypes.RD,
            ...parfinSendDTO,
          };
          const { id: dbTransactionId } = await this.transactionService.create(
            transactionData,
          );

          try {
            // 5 - Assinar transação e inserir na blockchain
            return await this.transactionService.transactionSignAndPush(
              transactionId,
              dbTransactionId,
            );
          } catch (error) {
            throw new Error(
              `Erro ao tentar assinar transação ${transactionId} de queima de Real Tokenizado / Erro: ${error}`
            );
          }
        } catch (error) {
          throw new Error(
            `Erro ao tentar salvar transação ${transactionId} de queima de Real Tokenizado no banco / Erro: ${error}`
          );
        }
      }
    } catch (error) {
      throw new Error(`Erro ao tentar criar transação de queima de Real Tokenizado / Erro: ${error}`);
    }
  }

  async internalTransfer({ dto }: IServiceDTO): Promise<any> {
    const { key, amount } = dto as RealTokenizadoInternalTransferDTO;
    const parfinCallDTO = dto as Pick<RealTokenizadoInternalTransferDTO, 'callMetadata' | 'blockchainId'>;

    //TODO: Refatorar a criação de todos os metadata.data

    // 1 - Buscar carteira do destinatário usando o CPF do cliente da instituição

    // 1.1 - Buscar endereço do contrato KeyDictionary.sol
    const { contractAddress } = parfinCallDTO.callMetadata; // TODO: usar o AddressDiscovery.sol

    // 1.2 - Criar instância do contrato KeyDictionary.sol
    this.contractHelper.setContract(
      keyDictionaryABI,
      contractAddress,
    );

    // 1.3 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinCallDTO.callMetadata.data = this.contractHelper
      .getContract()
      .methods.getWallet(key)
      .encodeABI();

    try {
      // 1.4 - Interagir com o contrato usando o endpoint call/read
      const parfinCallRes = await this.parfinService.smartContractCall(parfinCallDTO);
      const { data } = parfinCallRes as ParfinContractCallSuccessRes;

      if (data) {
        // 1.5 - Recuperar o CPF das informações consultdas no contrato
        const receiverAddress = '';

        // 2 - Executar a transferência
        const parfinSendDTO = dto as Omit<
          RealTokenizadoInternalTransferDTO, 'key' | 'amount' | 'blockchainId' | 'callMetadata'
        >;
        const { contractAddress } = parfinSendDTO.sendMetadata

        // 2.1 - Criar instância do contrato RealTokenizado.sol
        this.contractHelper.setContract(
          realTokenizadoABI,
          contractAddress,
        );

        // 2.2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
        parfinSendDTO.sendMetadata.data = this.contractHelper
          .getContract()
          .methods.transfer(receiverAddress, amount)
          .encodeABI();

        try {
          // 2.3 - Interagir com o contrato usando o endpoint send/write
          const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
          const { id: transactionId } = parfinSendRes as ParfinSuccessRes

          if (transactionId) {
            try {
              // 2.4 - Salvar transação no banco
              const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.TRANSFER,
                asset: AssetTypes.RD,
                ...parfinSendDTO,
              };
              const { id: dbTransactionId } = await this.transactionService.create(
                transactionData,
              );

              if (dbTransactionId) {
                try {
                  // 2.5 - Assinar transação e inserir na blockchain
                  return await this.transactionService.transactionSignAndPush(
                    transactionId,
                    dbTransactionId,
                  );
                } catch (error) {
                  throw new Error(
                    `Erro ao tentar assinar transação ${transactionId} de transferência interna de Real Tokenizado / Erro: ${error}`
                  );
                }
              }
            } catch (error) {
              throw new Error(
                `Erro ao tentar salvar transação ${transactionId} de transferência de Real Tokenizado no banco / Erro: ${error}`
              );
            }
          }
        } catch (error) {
          throw new Error(`Erro ao tentar criar transação de transferência de Real Tokenizado / Erro: ${error}`);
        }
      }
    } catch (error) {
      throw new Error(`Erro ao tentar buscar carteira do destinatário com documento: ${key} / Erro: ${error}`);
    }
  }
}
