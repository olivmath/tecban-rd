import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
  ParfinContractCallSuccessRes, ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';
import { TPFtGetBalanceOfSuccessRes, TPFtBuyRes, TPFtSellRes, TPFtExternalBuyRes, TPFtApproveTradeRes } from 'src/res/app/tpft.responses';
import {
  TPFtSetApprovalForAllDTO,
  TPFtGetBalanceOfDTO,
  TPFtAuctionPlacementDTO,
  TPFtInstitutionSellToAnInstitutionDTO,
  TPFtInstitutionBuyFromAnInstitutionDTO,
  TPFtBuyParticipantAndItsClientDTO,
  TPFtSellParticipantAndItsClientDTO,
  TPFfBuyDTO,
  TPFtSellDTO,
  TPFtApproveTradeDTO
} from 'src/dtos/tpft.dto';
import { TpftAcronym, TpftID } from 'src/types/tpft.types';
import Web3 from 'web3';
import { EncodeDataDTO } from 'src/dtos/contract-helper.dto';
import { EncodedDataResponse } from 'src/res/app/contract-helper.responses';
import { RealDigitalService } from 'src/real-digital/real-digital.service';
import { RealDigitalApproveDTO } from 'src/dtos/real-digital.dto';
import { ContractApproveRes } from 'src/res/app/contract.responses';
import { UtilsService } from 'src/utils/util.service';
import { RealTokenizadoService } from 'src/real-tokenizado/real-tokenizado.service';
import { RealTokenizadoApproveDTO } from 'src/dtos/real-tokenizado.dto';

@Injectable()
export class TPFtService {
  tpft: WrapperContractABI;
  constructor(
    private readonly utilsService: UtilsService,
    private readonly contractHelper: ContractHelperService,
    private readonly parfinService: ParfinService,
    private readonly realDigitalService: RealDigitalService,
    private readonly realTokenizadoService: RealTokenizadoService,
    private readonly logger: LoggerService,
  ) {
    this.tpft = this.contractHelper.getContractMethods('ITPFT');
    this.logger.setContext('TPFtService');
  }

  async approveParticipantAndDifferentClientTrade(dto: TPFtApproveTradeDTO): Promise<TPFtApproveTradeRes | any> {
    // 1. Buscando os endereços dos contratos
    const { receiverWallet, receiverAssetId, total, formattedTotal } = dto;
    const institutionWallet = process.env.ARBI_DEFAULT_WALLET_ADDRESS;
    const institutionAssetId = process.env.ARBI_RD_ASSET_ID;

    const tpftDvp = 'TPFT_DVP';
    const { address: tpftDvpAddress } = this.contractHelper.getContractAddress(tpftDvp);
    if (!tpftDvpAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftDvp}`);
    }

    const swapOneStepFrom = 'SWAP_ONE_STEP_FROM';
    const { address: swapOneStepFromAddress } = this.contractHelper.getContractAddress(swapOneStepFrom);
    if (!swapOneStepFromAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftDvp}`);
    }

    // 2. Arpovando o contrato TPFtDvP a manipular Real Digital na carteira da IF do comprador
    const realDigitalTpftDvpApproveDTO: RealDigitalApproveDTO = {
      description:
        `Aprovando o contrato TPFtDvP a debitar $${total} RD da carteira ${receiverWallet} para a compra de TPFt`,
      walletAddress: institutionWallet,
      assetId: institutionAssetId,
      spender: tpftDvpAddress,
      amount: formattedTotal,
    }
    const realDigitalTpftDvpApproveRes =
      await this.realDigitalService.approve(realDigitalTpftDvpApproveDTO);

    const { parfinTxId: realDigitalTpftDvpApprovalTxId } =
      realDigitalTpftDvpApproveRes as ContractApproveRes;
    if (!realDigitalTpftDvpApprovalTxId) {
      throw new Error(`[ERROR]: Erro ao aprovar o débito de Real Digital na carteira ${receiverWallet}`);
    }

    // 3. Arpovando o contrato SwapOneStepFrom a manipular Real Digital na carteira do comprador
    const realDigitalSwapOneStepFromApproveDTO: RealDigitalApproveDTO = {
      description:
        `Aprovando o contrato SwapOneStepFrom a debitar $${total} RD da carteira ${receiverWallet} para a compra de TPFt`,
      walletAddress: receiverWallet,
      assetId: receiverAssetId,
      spender: swapOneStepFromAddress,
      amount: formattedTotal,
    }
    const realDigitalSwapOneStepFromApproveRes =
      await this.realDigitalService.approve(realDigitalSwapOneStepFromApproveDTO);

    const { parfinTxId: realDigitalSwapOneStepFromApprovalTxId } =
      realDigitalSwapOneStepFromApproveRes as ContractApproveRes;
    if (!realDigitalSwapOneStepFromApprovalTxId) {
      throw new Error(`[ERROR]: Erro ao aprovar o débito de Real Digital na carteira ${receiverWallet}`);
    }

    // 4. Arpovando o contrato TPFtDvP a manipular Real Tokenizado na carteira do comprador
    const realTokenizadoTpftDvpApproveDTO: RealTokenizadoApproveDTO = {
      description:
        `Aprovando o contrato TPFtDvP a debitar $${total} RT da carteira ${receiverWallet} para a compra de TPFt`,
      walletAddress: receiverWallet,
      assetId: receiverAssetId,
      spender: tpftDvpAddress,
      amount: formattedTotal,
    }
    const realTokenizadoTpftDvpApproveRes =
      await this.realTokenizadoService.approve(realTokenizadoTpftDvpApproveDTO);

    const { parfinTxId: realTokenizadoTpftDvpApprovalTxId } =
      realTokenizadoTpftDvpApproveRes as ContractApproveRes;
    if (!realTokenizadoTpftDvpApprovalTxId) {
      throw new Error(`[ERROR]: Erro ao aprovar o débito de Real Digital na carteira ${receiverWallet}`);
    }

    return {
      realDigitalTpftDvpApprovalTxId,
      realDigitalSwapOneStepFromApprovalTxId,
      realTokenizadoTpftDvpApprovalTxId
    } as TPFtApproveTradeRes;
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
    let tpftAcronym: TpftAcronym;

    const currentDate = new Date();
    let expirationDate: Date;
    let isExpired: boolean;

    switch (tpftID) {
      case TpftID.LTN_11_2023:
        tpftAcronym = TpftAcronym.LTN;
        expirationDate = new Date('2023-11-21');
        isExpired = currentDate >= expirationDate ? true : false;
        break;
      case TpftID.LFT_01_2024:
        tpftAcronym = TpftAcronym.LFT;
        expirationDate = new Date('2024-01-25');
        isExpired = currentDate >= expirationDate ? true : false;
        break;
      case TpftID.LTN_11_2024:
        tpftAcronym = TpftAcronym.LTN;
        expirationDate = new Date('2024-11-21');
        isExpired = currentDate >= expirationDate ? true : false;
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
        tpftAcronym,
        tpftBalanceOf: this.tpft['balanceOf'](balanceOf)[0],
        expirationDate,
        isExpired,

      };
    } catch (error) {
      this.logger.error(error);
      throw new Error(`[ERROR]: Erro ao tentar buscar o saldo de TPFt do address: ${address}`);
    }
  }

  // --- Operation 1002: TPFt Public Liquidity
  async auctionPlacement(dto: TPFtAuctionPlacementDTO): Promise<any> {
    const {
      description,
      operationId,
      tpftSymbol,
      tpftAmount,
    } = dto as TPFtAuctionPlacementDTO;

    // 1. Criando o Parfin DTO para o método auctionPlacement()
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const cnpj8Sender = process.env.STN_CNPJ8;
    const cnpj8Receiver = process.env.ARBI_CNPJ8;
    const callerPartBySender = web3.utils.toBN(1);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId: process.env.ARBI_BACEN_ASSET_ID };

    const { acronym, code, maturityDate, unitPrice, floatUnitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    try {
      // 2. Pegando endereço do contrato ITPFtOperation1002
      const tpftAddress = process.env.TPFT_1002_ADDRESS;

      // 3. Criando o metadata do auctionPlacement()
      parfinSendDTO.metadata = {
        data: '',
        contractAddress: tpftAddress,
        from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
      };
      const tpftData = {
        acronym,
        code,
        maturityDate,
      };
      const dataToEncode: EncodeDataDTO = {
        contractName: 'ITPFT_1002',
        functionName: 'auctionPlacement(uint256,uint256,uint256,uint8,tuple,uint256,uint256)',
        args: [
          Number(operationId),
          Number(cnpj8Sender),
          Number(cnpj8Receiver),
          callerPartBySender,
          tpftData,
          Number(tpftAmount),
          unitPrice,
        ],
      };

      // 4. Codificando o data do metadata
      const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
      const { data: encodedData } = encodeDataRes as EncodedDataResponse;
      if (typeof encodedData[0] !== 'string') {
        throw new Error(
          `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
        );
      }
      parfinSendDTO.metadata.data = encodedData[0];

      // 5. Interagindo com o método auctionPlacement()
      const parfinSendRes = await this.parfinService.smartContractSend(
        parfinSendDTO,
      );

      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
      if (!transactionId) {
        const payload = JSON.stringify(parfinSendDTO)
        throw new Error(
          `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
        );
      }

      // 6. Assinando a transação do auctionPlacement()
      await this.parfinService.transactionSignAndPush(transactionId);

      return {
        parfinTxId: transactionId,
        txData: dataToEncode,
      };
    } catch (error) {
      const payload = JSON.stringify(parfinSendDTO)
      this.logger.error(error);
      throw new Error(
        `[ERROR]: Erro ao tentar adquirir ${tpftAmount} ${acronym} do STN através da oferta pública. 
            Parfin Send DTO: ${payload}`
      );
    }
  }

  // --- Operation 1052: Buy and Sell TPFt

  // - Buy TPFt from another institution using CNPJ
  async buyTpftFromAnInstitution(dto: TPFtInstitutionBuyFromAnInstitutionDTO): Promise<TPFtBuyRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      operationId,
      cnpj8Sender,
      tpftSymbol,
      tpftAmount,
    } = dto;

    const receiverWallet = process.env.ARBI_DEFAULT_WALLET_ADDRESS;
    const receiverAssetId = process.env.ARBI_RD_ASSET_ID;
    const bacenAssetId = process.env.ARBI_BACEN_ASSET_ID;

    const tpftDvp = 'TPFT_DVP';
    const { address: tpftDvpAddress } = this.contractHelper.getContractAddress(tpftDvp);
    if (!tpftDvpAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftDvp}`);
    }

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const cnpj8Receiver = process.env.ARBI_CNPJ8;
    const callerPartBySender = web3.utils.toBN(1);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId: bacenAssetId };

    const { acronym, code, maturityDate, unitPrice, floatUnitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Aprovar o valor da transação no RealDigital da carteira do receiver
    const { total, formattedTotal } = this.utilsService.getTradeTotal(tpftAmount, floatUnitPrice)
    const approveDTO: RealDigitalApproveDTO = {
      description:
        `Aprovando o débito de $${total} na carteira ${receiverWallet} para a compra de ${tpftAmount} ${acronym}`,
      walletAddress: receiverWallet,
      assetId: receiverAssetId,
      spender: tpftDvpAddress,
      amount: formattedTotal,
    }
    const approveRes = await this.realDigitalService.approve(approveDTO);
    const { parfinTxId: approveTxId } = approveRes as ContractApproveRes;
    if (!approveTxId) {
      throw new Error(`[ERROR]: Erro ao aprovar o débito de Real Digital na carteira ${receiverWallet}`);
    }

    // 4. Criar o metadata de interação com o método trade()
    parfinSendDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: receiverWallet,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,uint256,uint256,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        Number(cnpj8Sender),
        Number(cnpj8Receiver),
        callerPartBySender,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 5. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    parfinSendDTO.metadata.data = encodedData[0];

    // 6. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      parfinSendDTO,
    );

    const { id: tradeTxId } = parfinSendRes as ParfinSuccessRes;
    if (!tradeTxId) {
      const payload = JSON.stringify(parfinSendDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato ${tpftOperation1052}. Parfin Send DTO: ${payload}`
      );
    }

    // 7. Assinar a transação e retornar o ID
    await this.parfinService.transactionSignAndPush(tradeTxId);

    return {
      approvalTxId: approveTxId,
      purchaseTxId: tradeTxId,
      txData: dataToEncode,
    };
  }

  // - Sell TPFt from another institution using CNPJ
  async sellTpftToAnInstitution(dto: TPFtInstitutionSellToAnInstitutionDTO): Promise<TPFtSellRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      cnpj8Receiver,
      tpftSymbol,
      tpftAmount,
    } = dto;
    const operationId = this.utilsService.generateOperationId().toString();

    const senderWallet = process.env.ARBI_DEFAULT_WALLET_ADDRESS;
    const bacenAssetId = process.env.ARBI_BACEN_ASSET_ID;

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const cnpj8Sender = process.env.ARBI_CNPJ8;
    const callerPartBySender = web3.utils.toBN(0);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId: bacenAssetId };

    const { acronym, code, maturityDate, unitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Criar o metadata de interação com o método trade()
    parfinSendDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: senderWallet,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,uint256,uint256,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        Number(cnpj8Sender),
        Number(cnpj8Receiver),
        callerPartBySender,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 4. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    parfinSendDTO.metadata.data = encodedData[0];

    // 5. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      parfinSendDTO,
    );

    const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
    if (!transactionId) {
      const payload = JSON.stringify(parfinSendDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
      );
    }

    // 6. Assinar a transação e retornar o ID
    await this.parfinService.transactionSignAndPush(transactionId);

    return {
      parfinTxId: transactionId,
      txData: dataToEncode,
    };
  }

  // --- Operation 1052: Customer Buy and Sell TPFt

  // - Buy TPFt from institution or its customer
  async buyTpftParticipantAndItsClient(dto: TPFtBuyParticipantAndItsClientDTO): Promise<TPFtBuyRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      assetId,
      operationId,
      sender,
      receiver,
      tpftSymbol,
      tpftAmount,
    } = dto;

    const receiverWallet = receiver;
    const receiverAssetId = assetId;

    const realTokenizado = 'ARBI_REAL_TOKENIZADO';
    const { address: realTokenizadoAddress } = this.contractHelper.getContractAddress(realTokenizado);
    if (!realTokenizadoAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${realTokenizado}`);
    }

    const tpftDvp = 'TPFT_DVP';
    const { address: tpftDvpAddress } = this.contractHelper.getContractAddress(tpftDvp);
    if (!tpftDvpAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftDvp}`);
    }

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin para o método trade()
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...tradeDTO } = parfinDTO;

    const callerPartByReceiver = web3.utils.toBN(1);

    tradeDTO.description = description;
    tradeDTO.source = { assetId: receiverAssetId };

    const { acronym, code, maturityDate, unitPrice, floatUnitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Aprovar o valor da transação no RealTokenizado da carteira do receiver com o método approve()
    const { total, formattedTotal } = this.utilsService.getTradeTotal(tpftAmount, floatUnitPrice)
    const approveDTO: RealTokenizadoApproveDTO = {
      description:
        `Aprovando o débito de $${total} na carteira ${receiverWallet} para a compra de ${tpftAmount} ${acronym}`,
      walletAddress: receiverWallet,
      assetId: receiverAssetId,
      spender: tpftDvpAddress,
      amount: formattedTotal,
    }
    const approveRes = await this.realTokenizadoService.approve(approveDTO);
    const { parfinTxId: approveTxId } = approveRes as ContractApproveRes;
    if (!approveTxId) {
      throw new Error(`[ERROR]: Erro ao aprovar o débito de Real Digital na carteira ${receiverWallet}`);
    }

    // 4. Criar o metadata de interação com o método trade()
    tradeDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: receiverWallet,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        sender,
        realTokenizadoAddress,
        receiver,
        realTokenizadoAddress,
        callerPartByReceiver,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 5. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    tradeDTO.metadata.data = encodedData[0];

    // 6. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      tradeDTO,
    );

    const { id: tradeTxId } = parfinSendRes as ParfinSuccessRes;
    if (!tradeTxId) {
      const payload = JSON.stringify(tradeDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato ${tpftOperation1052}. Parfin Send DTO: ${payload}`
      );
    }

    // 7. Assinar a transação e retornar os dados da transação
    await this.parfinService.transactionSignAndPush(tradeTxId);

    return {
      approvalTxId: approveTxId,
      purchaseTxId: tradeTxId,
      txData: dataToEncode,
    };
  }

  // - Sell TPFt to institution or its customer
  async sellTpftParticipantAndItsClient(dto: TPFtSellParticipantAndItsClientDTO): Promise<TPFtSellRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      assetId,
      sender,
      receiver,
      tpftSymbol,
      tpftAmount,
    } = dto;
    const operationId = this.utilsService.generateOperationId().toString();

    const senderWallet = sender;

    const realTokenizado = 'ARBI_REAL_TOKENIZADO';
    const { address: realTokenizadoAddress } = this.contractHelper.getContractAddress(realTokenizado);
    if (!realTokenizadoAddress) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${realTokenizado}`);
    }

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const callerPartBySender = web3.utils.toBN(0);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId };

    const { acronym, code, maturityDate, unitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Criar o metadata de interação com o método trade()
    parfinSendDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: senderWallet,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        sender,
        realTokenizadoAddress,
        receiver,
        realTokenizadoAddress,
        callerPartBySender,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 4. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    parfinSendDTO.metadata.data = encodedData[0];

    // 5. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      parfinSendDTO,
    );

    const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
    if (!transactionId) {
      const payload = JSON.stringify(parfinSendDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
      );
    }

    // 6. Assinar a transação e retornar o ID
    await this.parfinService.transactionSignAndPush(transactionId);

    return {
      parfinTxId: transactionId,
      txData: dataToEncode,
    };
  }

  // - Buy TPFt: Client Institution A -> Institution B
  async buyTpftParticipantAndDifferentClient(dto: TPFfBuyDTO): Promise<TPFtExternalBuyRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      assetId,
      operationId,
      sender,
      senderToken,
      receiver,
      receiverToken,
      tpftSymbol,
      tpftAmount,
    } = dto;

    const receiverWallet = receiver;
    const receiverAssetId = assetId;

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin para o método trade()
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const callerPartByReceiver = web3.utils.toBN(1);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId: receiverAssetId };

    const { acronym, code, maturityDate, unitPrice, floatUnitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Executar as aprovações necessárias transação
    const { total, formattedTotal } = this.utilsService.getTradeTotal(tpftAmount, floatUnitPrice);
    const approveDTO: TPFtApproveTradeDTO = {
      receiverWallet,
      receiverAssetId,
      total,
      formattedTotal,
    }
    const approveRes = await this.approveParticipantAndDifferentClientTrade(approveDTO);
    const {
      realDigitalTpftDvpApprovalTxId, realDigitalSwapOneStepFromApprovalTxId, realTokenizadoTpftDvpApprovalTxId,
    } = approveRes as TPFtApproveTradeRes;

    // 4. Criar o metadata de interação com o método trade()
    parfinSendDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: receiverWallet,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        sender,
        senderToken,
        receiver,
        receiverToken,
        callerPartByReceiver,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 5. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    parfinSendDTO.metadata.data = encodedData[0];

    // 6. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      parfinSendDTO,
    );

    const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
    if (!transactionId) {
      const payload = JSON.stringify(parfinSendDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato ${tpftOperation1052}. Parfin Send DTO: ${payload}`
      );
    }

    // 7. Assinar a transação e retornar os dados da transação
    await this.parfinService.transactionSignAndPush(transactionId);

    return {
      realDigitalTpftDvpApprovalTxId: realDigitalTpftDvpApprovalTxId,
      realDigitalSwapOneStepFromApprovalTxId: realDigitalSwapOneStepFromApprovalTxId,
      realTokenizadoTpftDvpApprovalTxId: realTokenizadoTpftDvpApprovalTxId,
      purchaseTxId: transactionId,
      txData: dataToEncode,
    } as TPFtExternalBuyRes;
  }
  // - Sell TPFt: Institution A -> Client Institution B
  async sellTpftParticipantAndDifferentClient(dto: TPFtSellDTO): Promise<TPFtSellRes | any> {
    // 1. Receber o DTO da operação e buscar os endereços dos contratos
    const {
      description,
      assetId,
      sender,
      senderToken,
      receiver,
      receiverToken,
      tpftSymbol,
      tpftAmount,
    } = dto;
    const operationId = this.utilsService.generateOperationId().toString();

    const tpftOperation1052 = 'ITPFT_1052';
    const { address: tpftOperation1052Address } = this.contractHelper.getContractAddress(tpftOperation1052);
    if (!tpftOperation1052Address) {
      throw new Error(`[ERROR]: Erro ao buscar o contrato ${tpftOperation1052}`);
    }

    // 2. Criar o DTO da Parfin
    const web3 = new Web3();
    const parfinDTO = new ParfinContractInteractDTO();
    const { blockchainId, ...parfinSendDTO } = parfinDTO;

    const callerPartBySender = web3.utils.toBN(0);

    parfinSendDTO.description = description;
    parfinSendDTO.source = { assetId };

    const { acronym, code, maturityDate, unitPrice } = this.utilsService.setTpftInfo(tpftSymbol);

    // 3. Criar o metadata de interação com o método trade()
    parfinSendDTO.metadata = {
      data: '',
      contractAddress: tpftOperation1052Address,
      from: sender,
    };
    const tpftData = {
      acronym,
      code,
      maturityDate,
    };
    const dataToEncode: EncodeDataDTO = {
      contractName: tpftOperation1052,
      functionName: 'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
      args: [
        Number(operationId),
        sender,
        senderToken,
        receiver,
        receiverToken,
        callerPartBySender,
        tpftData,
        Number(tpftAmount),
        unitPrice,
      ],
    };

    // 4. Codificar o data do metadata
    const encodeDataRes = this.contractHelper.encodeData(dataToEncode);
    const { data: encodedData } = encodeDataRes as EncodedDataResponse;
    if (typeof encodedData[0] !== 'string') {
      throw new Error(
        `[ERROR]: Erro ao codificar os dados do contrato: ${dataToEncode}`
      );
    }
    parfinSendDTO.metadata.data = encodedData[0];

    // 5. Interagir com o método trade()
    const parfinSendRes = await this.parfinService.smartContractSend(
      parfinSendDTO,
    );

    const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
    if (!transactionId) {
      const payload = JSON.stringify(parfinSendDTO)
      throw new Error(
        `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
      );
    }

    // 6. Assinar a transação e retornar o ID
    await this.parfinService.transactionSignAndPush(transactionId);

    return {
      parfinTxId: transactionId,
      txData: dataToEncode,
    };
  }
}
