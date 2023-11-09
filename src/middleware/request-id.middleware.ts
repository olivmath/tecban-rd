import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        let requestId = req.headers['x-request-id'] as string;
        if (!requestId) {
            requestId = uuidv4();
            req.headers['x-request-id'] = requestId;
        }
        req['requestId'] = requestId;
        next();
    }
}
