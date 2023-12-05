import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from 'src/logger/logger.service';
import { AppError } from 'src/error/app.error';
import * as crypto from 'crypto';

@Injectable()
export class WebhookValidationMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) {}
    use(req: Request, res: Response, next: NextFunction): void {
        const signature = req.headers['x-webhook-signature'] as string;

        const hash = crypto
            .createHmac('sha256', process.env.PARFIN_PRIVATE_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash !== signature) {
            const requestId = req['requestId'] || req.headers['x-request-id'];
            throw new AppError(401, 'Invalid webhook signature', { requestId });
        }

        next();
    }
}
