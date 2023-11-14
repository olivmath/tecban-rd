type ParfinError = {
    url: string;
    response: {
        status: number;
        body: object;
        headers: object;
    };
    request: {
        body: object;
        headers: object;
    };
};

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly parfinError: ParfinError;
    public readonly errorLocation: string;
    public readonly originalStack: string;
    public requestId: string;

    /**
     * @param statusCode O código de status HTTP que vai voltar pro cliente.
     * @param message A mensagem de erro que vai voltar pro cliente .
     * @param data Dados adicionais, como parfinError ou erro original (Apenas para log).
     */
    constructor(statusCode: number, message: string, data?: { parfinError?: ParfinError; erro?: Error, requestId?: string }) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.parfinError = data?.parfinError || {
            url: '',
            response: { status: 0, body: {}, headers: {} },
            request: { body: {}, headers: {} },
        };
        this.originalStack = data?.erro ? this.captureOriginalStack(data.erro) : '';
        this.errorLocation = this.getErrorLocation(this.stack);

        this.requestId = data?.requestId || "no-request-id";
    }

    private captureOriginalStack(erro: Error) {
        return erro.stack || '';
    }

    private getErrorLocation(stack: string) {
        const stackLines = stack.split('\n');
        const stackLine = stackLines?.[1] || '';
        const [, location = ''] = stackLine.includes('(') ? stackLine.split(' (') : stackLine.split('at ');
        return location.replace(')', '').trim();
    }

    setRequestId(requestId: string) {
        this.requestId = requestId;
    }
}
