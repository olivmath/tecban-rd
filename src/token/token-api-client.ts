import axios from 'axios';

export const parfinApi = axios.create({
  baseURL: process.env.PARFIN_API_V1_URL,
});
