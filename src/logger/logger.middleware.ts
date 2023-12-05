import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('LoggerMiddleware');
    }

    use(req: Request, res: Response, next: NextFunction) {
        const requestId = req.headers['x-request-id'].toString();

        this.logger.logRequest(requestId, req.method, req.originalUrl);

        const { method, originalUrl } = req;
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const { statusCode } = res;
            if (statusCode < 400) {
                this.logger.logResponse(requestId, method, originalUrl, statusCode, duration);
            }
        });

        next();
    }
}
