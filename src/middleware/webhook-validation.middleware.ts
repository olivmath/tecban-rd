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
        const secret = process.env.PARFIN_PRIVATE_KEY;
        const payload = JSON.stringify(req.body);

        if (!this.isValidSignature(signature, payload, secret)) {
            throw new AppError(401, 'Invalid webhook signature');
        }

        this.logger.log(req.headers["x-webhook-entity"] as string)
        this.logger.log(req.headers["x-webhook-event-id"] as string)

        next();
    }
    
    private isValidSignature(signature: string, payload: string, secret: string): boolean {
        const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        return hash === signature;
    }
}
