import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
  ParfinContractCallSuccessRes, ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';
import { TPFtGetBalanceOfSuccessRes } from 'src/res/app/tpft.responses';
import { TPFtGetBalanceOfDTO, TPFtSetApprovalForAllDTO } from 'src/dtos/tpft.dto';
import { TpftName } from 'src/types/tpft.types';
import { EncodeDataDTO } from 'src/dtos/contract-helper.dto';
import { EncodedDataResponse } from 'src/res/app/contract-helper.responses';

@Injectable()
export class TPFtService {
  tpft: WrapperContractABI;
  constructor(
    private readonly contractHelper: ContractHelperService,
    private readonly parfinService: ParfinService,
    private readonly logger: LoggerService,
  ) {
    this.tpft =
      this.contractHelper.getContractMethods('ITPFT');
    this.logger.setContext('TPFtService');
  }

  async setApprovalForAll(dto: TPFtSetApprovalForAllDTO): Promise<any> {
    const { description, walletAddress, assetId, operator, approved } = dto as TPFtSetApprovalForAllDTO;
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;
    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId };

    try {
      // 1. Buscando o endereço do contrato ITPFt
      const tpftAddress = process.env.TPFT_ADDRESS;

      // 2. Criando o metadata para interagir com o método setApprovalForAll()
      parfinSendDTO.metadata = {
        data: '',
        contractAddress: tpftAddress,
        from: walletAddress,
      };
      const dataToEncode: EncodeDataDTO = {
        contractName: 'ITPFT',
        functionName: 'setApprovalForAll(address,bool)',
        args: [
          operator,
          approved,
        ],
      };
      const encodedDataRes = this.contractHelper.encodeData(dataToEncode);
      const { data: encodedData } = encodedDataRes as EncodedDataResponse;
      if (typeof encodedData[0] !== 'string') {
        throw new Error(
          `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
        );
      }
      parfinSendDTO.metadata.data = encodedData[0];

      // 3. Interagindo com o contrato ITPFt através do método setApprovalForAll()
      const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
      if (!transactionId) {
        const payload = JSON.stringify(parfinSendDTO)
        throw new Error(
          `[ERROR]: Erro ao tentar interagir com contrato ${tpftAddress}. Parfin Send DTO: ${payload}`
        );
      }

      // 5. Assinando a transação na Parfin
      await this.parfinService.transactionSignAndPush(transactionId);

      return {
        parfinTxId: transactionId,
      };
    } catch (error) {
      const payload = JSON.stringify(parfinSendDTO);
      this.logger.error(error);
      throw new Error(
        `[ERROR]: Erro ao tentar aprovar que o contrato ${operator} manipule TPFt. 
                Parfin Send DTO: ${payload}`,
      );
    }
  }

  async balanceOf(dto: TPFtGetBalanceOfDTO): Promise<TPFtGetBalanceOfSuccessRes> {
    const { address, tpftID } = dto;
    let tpftName: TpftName;

    switch (tpftID) {
      case '1':
        tpftName = TpftName.LTN;
        break;
      case '2':
        tpftName = TpftName.LFT;
        break;
    }

    try {
      const tpftAddress = process.env.TPFT_ADDRESS;

      const encodedBalanceOfCall = this.tpft['balanceOf(address,uint256)'](address, Number(tpftID))[0];

      const parfinDTO = new ParfinContractInteractDTO();

      const requests = [
        { id: 'balanceOf', data: encodedBalanceOfCall },
      ];

      const allResponse = await Promise.all(
        requests.map(async (request) => {
          return this.parfinService.smartContractCall({
            metadata: {
              data: request.data,
              contractAddress: tpftAddress,
            },
            blockchainId: parfinDTO.blockchainId,
          });
        }),
      );

      const responses: { balanceOf?: string; frozenBalanceOf?: string } = {};
      allResponse.forEach((response: ParfinContractCallSuccessRes, index) => {
        const requestId = requests[index].id;
        responses[requestId] = response.data;
      });

      const balanceOf = responses.balanceOf;

      return {
        tpftID,
        tpftName,
        tpftBalanceOf: this.tpft['balanceOf'](balanceOf)[0],
      };
    } catch (error) {
      this.logger.error(error);
      throw new Error(`[ERROR]: Erro ao tentar buscar o saldo de TPFt do address: ${address}`);
    }
  }
}