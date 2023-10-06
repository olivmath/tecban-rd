import { Injectable } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract/contract';
import { IServiceDTO } from 'src/interfaces/service';
import strABI from '../ABI/STR.abi.json';
import realDigitalABI from '../ABI/RealDigital.abi.json';
import realDigitalDefaultAccountABI from '../ABI/RealDigitalDefaultAccount.abi.json';

import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/types/transactions.types';
import {
  RealDigitalMintDTO,
  RealDigitalBurnDTO,
  RealDigitalTransferDTO
} from './dtos/real-digital.dto';
import {
  TransactionsService,
} from 'src/transactions/transactions.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinContractCallSuccessRes, ParfinSuccessRes } from 'src/res/parfin.responses';

// TODO: verificar a necessidade do 'await' antes do 'this

@Injectable()
export class RealDigitalService {
  constructor(
    private readonly contractHelper: ContractHelper,
    private readonly transactionService: TransactionsService,
    private readonly parfinService: ParfinService,
  ) { }

  async mint({ dto }: IServiceDTO): Promise<any> {
    const { amount } = dto as RealDigitalMintDTO;
    const parfinDTO = dto as Omit<RealDigitalMintDTO, 'amount' | 'blockchainId' | 'callMetadata'>;
    const { contractAddress } = parfinDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

    // 1 - Criar instância do contrato
    this.contractHelper.setContract(
      strABI,
      contractAddress,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinDTO.sendMetadata.data = this.contractHelper
      .getContract()
      .methods.requestToMint(amount)
      .encodeABI();

    // 3 - Interagir com o contrato usando o endpoint send/write
    try {
      const parfinSendRes = await this.parfinService.smartContractSend(parfinDTO);
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      if (transactionId) {
        try {
          // 4 - Salvar transação no banco
          const transactionData = {
            parfinTransactionId: transactionId,
            operation: TransactionOperations.MINT,
            asset: AssetTypes.RD,
            ...parfinDTO,
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
                `Erro ao tentar assinar transação ${transactionId} de emissão de Real Digital / Erro: ${error}`
              );
            }

          }
        } catch (error) {
          throw new Error(
            `Erro ao tentar salvar transação ${transactionId} de emissão de Real Digital no banco / Erro: ${error}`
          );
        }
      }
    } catch (error) {
      throw new Error(`Erro ao tentar criar transação de emissão de Real Digital / Erro: ${error}`);
    }
  }

  async burn({ dto }: IServiceDTO): Promise<any> {
    const { amount } = dto as RealDigitalBurnDTO;
    const parfinDTO = dto as Omit<RealDigitalBurnDTO, 'amount' | 'blockchainId' | 'callMetadata'>;
    const { contractAddress } = parfinDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

    // 1 - Criar instância do contrato
    this.contractHelper.setContract(
      strABI,
      contractAddress,
    );

    // 2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinDTO.sendMetadata.data = this.contractHelper
      .getContract()
      .methods.requestToBurn(amount)
      .encodeABI();

    try {
      // 3 - Interagir com o contrato usando o endpoint send/write
      const parfinSendRes = await this.parfinService.smartContractSend(parfinDTO);
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      if (transactionId) {
        try {
          // 4 - Salvar transação no banco
          const transactionData = {
            parfinTransactionId: transactionId,
            operation: TransactionOperations.BURN,
            asset: AssetTypes.RD,
            ...parfinDTO,
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
                `Erro ao tentar assinar transação ${transactionId} de queima de Real Digital / Erro: ${error}`
              );
            }
          }
        } catch (error) {
          throw new Error(`Erro ao tentar salvar transação ${transactionId} de queima no banco / Erro: ${error}`);
        }
      }
    } catch (error) {
      throw new Error(`Erro ao tentar criar transação de queima de Real Digital / Erro: ${error}`);
    }

  }

  async transfer({ dto }: IServiceDTO): Promise<any> {
    const { cnpj, amount } = dto as RealDigitalTransferDTO;
    const parfinCallDTO = dto as Pick<RealDigitalTransferDTO, 'callMetadata' | 'blockchainId'>;

    //TODO: Refatorar a criação de todos os metadata.data (send e call)

    // 1 - Buscar carteira do destinatário usando o CNPJ da insituição

    // 1.1 - Buscar endereço do contrato RealDigitalDefaulAccount.sol
    const { contractAddress } = parfinCallDTO.callMetadata; // TODO: usar o AddressDiscovery.sol

    // 1.2 - Criar instância do contrato RealDigitalDefaultAccount
    this.contractHelper.setContract(
      realDigitalDefaultAccountABI,
      contractAddress,
    );

    // 1.3 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
    parfinCallDTO.callMetadata.data = this.contractHelper
      .getContract()
      .methods.defaultAccount(cnpj)
      .encodeABI();

    try {
      // 1.4 - Interagir com o contrato usando o endpoint call/read para obter o endereço de destino
      const parfinCallRes = await this.parfinService.smartContractCall(parfinCallDTO) as ParfinContractCallSuccessRes;
      const { data } = parfinCallRes as ParfinContractCallSuccessRes;

      if (data) {
        // 1.5 - Recuperar o CNPJ das informações consultdas no contrato
        const receiverAddress = '';

        // 2 - Executar a transferência
        const parfinSendDTO = dto as Omit<RealDigitalTransferDTO, 'cnpj' | 'amount' | 'blockchainId' | 'callMetadata'>;
        const { contractAddress } = parfinSendDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

        // 2.1 - Criar instância do contrato RealDigital
        this.contractHelper.setContract(
          realDigitalABI,
          contractAddress,
        );

        // 2.2 - Criar o metadata usando o método e os parâmetros do método chamado no contrato
        parfinSendDTO.sendMetadata.data = this.contractHelper
          .getContract()
          .methods.transfer(receiverAddress, amount)
          .encodeABI();

        try {
          // 2.3 - Interagir com o contrato usando o endpoint send/write para executar a transferência
          const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
          const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

          if (transactionId) {
            try {
              // 2.4 - Salvar transação no banco
              const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.TRANSFER,
                asset: AssetTypes.RD,
                ...parfinSendDTO,
              };
              const { id: dbTransactionId } = await this.transactionService.create(transactionData);

              if (dbTransactionId) {
                try {
                  // 2.5 - Assinar transação e inserir na blockchain
                  return await this.transactionService.transactionSignAndPush(
                    transactionId,
                    dbTransactionId,
                  );
                } catch (error) {
                  throw new Error(
                    `Erro ao tentar assinar transação ${transactionId} de transferência de Real Digital / Erro: ${error}`
                  );
                }
              }
            } catch (error) {
              throw new Error(
                `Erro ao tentar salvar transação ${transactionId} de transferência de Real Digital no banco / Erro: ${error}`
              );
            }
          }
        } catch (error) {
          throw new Error(`Erro ao tentar criar transação de transferência de Real Digital / Erro: ${error}`);
        }

      }
    } catch (error) {
      throw new Error(`Erro ao tentar buscar carteira do destinatário com documento: ${cnpj} / Erro: ${error}`);
    }
  }
}
