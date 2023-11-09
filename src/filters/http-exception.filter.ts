import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AppError } from 'src/error/app.error';
import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let appErr: AppError;
        if (exception instanceof HttpException) {
            appErr = new AppError(exception.getStatus(), exception.message, { erro: exception });
        } else if (exception instanceof AppError === false) {
            appErr = new AppError(500, exception.message ? exception.message : 'Error desconhecido', {
                erro: exception,
            });
        } else {
            appErr = exception;
        }

        this.logger.error(appErr);

        const body = {
            message: appErr.message,
            timestamp: new Date().toISOString(),
            statusCode: appErr.statusCode,
        };

        response.setHeader('x-request-id', request['requestId'] || request.headers['x-request-id']);

        response.status(appErr.statusCode).json(body);
    }
}
