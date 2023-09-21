import { BurnDTO, MintDTO, TransferDTO } from 'src/token/dto/token-dto';

export interface IService {
  dto: MintDTO | BurnDTO | TransferDTO;
  contractId?: string;
}
