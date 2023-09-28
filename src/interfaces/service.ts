import {
  RealDigitalBurnDTO,
  RealDigitalMintDTO,
  RealDigitalTransferDTO
} from 'src/real-digital/dtos/real-digital.dto';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoTransferDTO
} from 'src/real-tokenizado/dtos/real-tokenizado.dto';
export interface IService {
  dto: RealDigitalMintDTO |
  RealDigitalBurnDTO |
  RealDigitalTransferDTO |
  RealTokenizadoMintDTO |
  RealTokenizadoBurnDTO |
  RealTokenizadoTransferDTO;
  contractId?: string;
}