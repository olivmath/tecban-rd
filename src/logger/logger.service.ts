// logger.middleware.ts
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { AppError } from 'src/error/app.error';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
    error(error: AppError | string) {
        if (typeof error == 'string') {
            super.error(error, "Before start app")
            if (error.startsWith("A aplicação não pode iniciar sem a variável")) {
                super.error("Verifique seu `.env`", "Before start app")
            }
        } else {
            const message = error.originalStack ? `From: ${error.originalStack} To: ` : '';
            super.error(
                `[Request-ID]: ${error.requestId} - ${message}\n${error.errorLocation}: ${error.message}`,
                this.context,
            );
            if (process.env.LOG === 'DEBUG' && error.parfinError) {
                super.error(`Api url: ${error.parfinError.url}`, this.context);

                const requestString = JSON.stringify(error.parfinError.request, null, 2);
                const responseString = JSON.stringify(error.parfinError.response, null, 2);

                super.error(`Request sent: ${requestString}`, this.context);
                super.error(`Response received: ${responseString}`, this.context);
            }
        }
    }

    logResponse(requestId: string, method: string, url: string, statusCode: number, duration: number) {
        this.log(`[Request-ID: ${requestId}] ${method} ${url} - StatusCode: ${statusCode} - ${duration}ms`);
    }

    logRequest(requestId: string, method: string, url: string) {
        this.log(`[Request-ID: ${requestId}] ${method} ${url}`);
    }
}
