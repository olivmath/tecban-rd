import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { MintDTO, BurnDTO, TransferDTO } from './dto/token-dto';
import {
  DeployContractDTO,
  ResponseDeployContractDTO,
} from 'src/shared-dtos/contract';

@Controller('token')
@ApiTags('Central Bank Tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  // Rota para realizar o deploy de um contrato
  @Post('deploy')
  async deployContract(
    @Body() deployContractDTO: DeployContractDTO,
  ): Promise<ResponseDeployContractDTO> {
    return await this.tokenService.deployContract(deployContractDTO);
  }

  // Rota para obter uma listagem de contratos
  @Get('contracts')
  getAllContracts() {
    return this.tokenService.getAllContracts();
  }

  // Rota para executar a emissão do token
  @Post(':contractId/mint')
  mint(@Param('contractId') contractId: string, @Body() mintDTO: MintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.tokenService.mint({ contractId, dto: mintDTO });
  }

  // Rota para executar o resgate do token
  @Post(':contractId/burn')
  burn(@Param('contractId') contractId: string, @Body() burnDTO: BurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.tokenService.burn({ contractId, dto: burnDTO });
  }

  // Rota para executar a transferência do token
  @Post(':contractId/transfer')
  transfer(
    @Param('contractId') contractId: string,
    @Body() transferDTO: TransferDTO,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.tokenService.transfer({ contractId, dto: transferDTO });
  }
}
