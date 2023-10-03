import {
  RealDigitalBurnDTO,
  RealDigitalMintDTO,
  RealDigitalTransferDTO
} from 'src/real-digital/dtos/real-digital.dto';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoInternalTransferDTO
} from 'src/real-tokenizado/dtos/real-tokenizado.dto';
export interface IServiceDTO {
  dto: RealDigitalMintDTO |
  RealDigitalBurnDTO |
  RealDigitalTransferDTO |
  RealTokenizadoMintDTO |
  RealTokenizadoBurnDTO |
  RealTokenizadoInternalTransferDTO;
}