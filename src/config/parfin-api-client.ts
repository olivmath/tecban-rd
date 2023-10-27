import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const parfinApi = axios.create({
    baseURL: process.env.PARFIN_API_V1_URL_SANDBOX,
    headers: {
        'Content-Type': 'application/json',
    },
});
