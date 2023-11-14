import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
  ParfinContractCallSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';
import { TPFtGetBalanceOfSuccessRes } from 'src/res/app/tpft.responses';
import { TPFtGetBalanceOfDTO } from 'src/dtos/tpft.dto';
import { TpftName } from 'src/types/tpft.types';

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