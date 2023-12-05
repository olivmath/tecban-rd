import { ApiResponse } from '@nestjs/swagger';
import { ParfinErrorRes } from '../app/parfin.responses';

export const appError400 = ApiResponse({ status: 400, description: 'Bad Request' });

export const parfinError400 = ApiResponse({ status: 400, description: 'Bad Request', type: ParfinErrorRes });
export const parfinError500 = ApiResponse({ status: 500, description: 'Server Error', type: ParfinErrorRes });