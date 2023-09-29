import { Priority } from 'src/transactions/dtos/transaction.dto';

export const parfinCreateWallet = {
  walletName: '', // Nome da carteira que será criada
  blockchainId: 'ba727c86-3d6d-44dd-af4c-1b34f1c3b00d', // ID da blockchain que representa o nosso nó
  walletType: 'CUSTODY', // Tipo de custódia da carteira (sempre esse valor)
};

export const parfinCallData = {
  metadata: {
    data: '', // Bytecode para consulta de informação do contrato
    contractAddress: '', // Endereço do contrato de consulta
  },
  blockchainId: 'ba727c86-3d6d-44dd-af4c-1b34f1c3b00d', // ID da blockchain que representa o nosso nó
};

export const parfinSendData = {
  customerTag: 'Banco Arbi', // Uma tag para identificar a insituição cliente da aplicação
  customerRefId: '3401602e-2953-4790-9109-11d16b844bf4', // Um uuid (v4) criado para representar o Banco Arbi
  source: {
    assetId: '', // ID do ativo que está sendo transacionado/operado
  },
  metadata: {
    data: '', // Bytecode para interação com o contrato
    contractAddress: '', // Endereço do contrato de interação
  },
  priority: Priority.HIGH, // Prioridade da transação
};