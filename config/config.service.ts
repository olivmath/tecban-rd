import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';
import { AppError } from 'src/error/app.error';



@Injectable()
export class ConfigService {
    PORT: number;
    DATABASE_URL: string;
    SWAGGER_URL: string;
    LOG: string;

    ARBI_USER_ID: string;
    ARBI_CLIENT_1_USER_ID: string;
    ARBI_CLIENT_2_USER_ID: string;

    PARFIN_API_V1_URL_SANDBOX: string;
    BLOCKCHAIN_ID: string;
    PARFIN_WALLET_ID: string;
    API_KEY: string;
    API_SECRET: string;
    ISSUER: string;
    AUDIENCE: string;
    PARFIN_PRIVATE_KEY: string;

    ARBI_DEFAULT_WALLET_ADDRESS: string;
    ARBI_RD_ASSET_ID: string;
    ARBI_RT_ASSET_ID: string;
    ARBI_CLIENT_1_WALLET_ADDRESS: string;
    ARBI_CLIENT_1_RT_ASSET_ID: string;
    ARBI_CLIENT_2_WALLET_ADDRESS: string;
    ARBI_CLIENT_2_RT_ASSET_ID: string;

    STN_CNPJ8: string;
    BRADESCO_CNPJ8: string;
    ABC_CNPJ8: string;
    INTER_CNPJ8: string;
    ITAU_CNPJ8: string;
    RIBEIRAO_PRETO_CNPJ8: string;
    TPFT_OPERATION_ID: string;
    LTN_ID: string;
    LFT_ID: string;
    ADDRESS_DISCOVERY_ADDRESS: string;
    TPFT_ADDRESS: string;
    TPFT_1002_ADDRESS: string;
    TPFT_1052_ADDRESS: string;
    TPFT_DVP_ADDRESS: string;
    KEY_DICTIONARY_ADDRESS: string;
    REAL_DIGITAL_ADDRESS: string;
    REAL_DIGITAL_DEFAULT_ACCOUNT_ADDRESS: string;
    REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS: string;
    ARBI_REAL_TOKENIZADO_ADDRESS: string;
    STR_ADDRESS: string;
    SWAP_ONE_STEP_ADDRESS: string;
    SWAP_ONE_STEP_FROM_ADDRESS: string;
    SWAP_TWO_STEP_ADDRESS: string;
    SWAP_TWO_STEP_RESERVE_ADDRESS: string;

    constructor() {
        dotenv.config();

        const ensure = (varName: string): string => {
            const value = process.env[varName];

            if (!value) {
              
                throw new AppError(500, `A aplicação não pode iniciar sem a variável: '${varName}'`);
            }

            return value;
        };

        this.PORT = parseInt(ensure('PORT'));
        this.DATABASE_URL = ensure('DATABASE_URL');
        this.SWAGGER_URL = ensure('SWAGGER_URL');
        this.LOG = ensure('LOG');

        this.ARBI_USER_ID = ensure('ARBI_USER_ID');
        this.ARBI_CLIENT_1_USER_ID = ensure('ARBI_CLIENT_1_USER_ID');
        this.ARBI_CLIENT_2_USER_ID = ensure('ARBI_CLIENT_2_USER_ID');

        this.PARFIN_API_V1_URL_SANDBOX = ensure('PARFIN_API_V1_URL_SANDBOX');
        this.BLOCKCHAIN_ID = ensure('BLOCKCHAIN_ID');
        this.PARFIN_WALLET_ID = ensure('PARFIN_WALLET_ID');
        this.API_KEY = ensure('API_KEY');
        this.API_SECRET = ensure('API_SECRET');
        this.ISSUER = ensure('ISSUER');
        this.AUDIENCE = ensure('AUDIENCE');
        this.PARFIN_PRIVATE_KEY = ensure('PARFIN_PRIVATE_KEY');

        this.ARBI_DEFAULT_WALLET_ADDRESS = ensure('ARBI_DEFAULT_WALLET_ADDRESS');
        this.ARBI_RD_ASSET_ID = ensure('ARBI_RD_ASSET_ID');
        this.ARBI_RT_ASSET_ID = ensure('ARBI_RT_ASSET_ID');
        this.ARBI_CLIENT_1_WALLET_ADDRESS = ensure('ARBI_CLIENT_1_WALLET_ADDRESS');
        this.ARBI_CLIENT_1_RT_ASSET_ID = ensure('ARBI_CLIENT_1_RT_ASSET_ID');
        this.ARBI_CLIENT_2_WALLET_ADDRESS = ensure('ARBI_CLIENT_2_WALLET_ADDRESS');
        this.ARBI_CLIENT_2_RT_ASSET_ID = ensure('ARBI_CLIENT_2_RT_ASSET_ID');

        this.STN_CNPJ8 = ensure('STN_CNPJ8');
        this.BRADESCO_CNPJ8 = ensure('BRADESCO_CNPJ8');
        this.ABC_CNPJ8 = ensure('ABC_CNPJ8');
        this.INTER_CNPJ8 = ensure('INTER_CNPJ8');
        this.ITAU_CNPJ8 = ensure('ITAU_CNPJ8');
        this.RIBEIRAO_PRETO_CNPJ8 = ensure('RIBEIRAO_PRETO_CNPJ8');
        this.TPFT_OPERATION_ID = ensure('TPFT_OPERATION_ID');
        this.LTN_ID = ensure('LTN_ID');
        this.LFT_ID = ensure('LFT_ID');
        this.ADDRESS_DISCOVERY_ADDRESS = ensure('ADDRESS_DISCOVERY_ADDRESS');
        this.TPFT_ADDRESS = ensure('TPFT_ADDRESS');
        this.TPFT_1002_ADDRESS = ensure('TPFT_1002_ADDRESS');
        this.TPFT_1052_ADDRESS = ensure('TPFT_1052_ADDRESS');
        this.TPFT_DVP_ADDRESS = ensure('TPFT_DVP_ADDRESS');
        this.KEY_DICTIONARY_ADDRESS = ensure('KEY_DICTIONARY_ADDRESS');
        this.REAL_DIGITAL_ADDRESS = ensure('REAL_DIGITAL_ADDRESS');
        this.REAL_DIGITAL_DEFAULT_ACCOUNT_ADDRESS = ensure('REAL_DIGITAL_DEFAULT_ACCOUNT_ADDRESS');
        this.REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS = ensure('REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS');
        this.ARBI_REAL_TOKENIZADO_ADDRESS = ensure('ARBI_REAL_TOKENIZADO_ADDRESS');
        this.STR_ADDRESS = ensure('STR_ADDRESS');
        this.SWAP_ONE_STEP_ADDRESS = ensure('SWAP_ONE_STEP_ADDRESS');
        this.SWAP_ONE_STEP_FROM_ADDRESS = ensure('SWAP_ONE_STEP_FROM_ADDRESS');
        this.SWAP_TWO_STEP_ADDRESS = ensure('SWAP_TWO_STEP_ADDRESS');
        this.SWAP_TWO_STEP_RESERVE_ADDRESS = ensure('SWAP_TWO_STEP_RESERVE_ADDRESS');
    }
}
