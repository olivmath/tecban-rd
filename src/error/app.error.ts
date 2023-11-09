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
    public readonly pathError: string;
    public readonly originalStack: string;
    public requestId: string

    constructor(statusCode: number, message: string, data?: { parfinError?: ParfinError; erro?: Error }) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.parfinError = data.parfinError;
        this.originalStack = data.erro ? this.getPathError(data.erro.stack) : ''
        Error.captureStackTrace(data.erro ? data.erro : this, this.constructor);

        this.pathError = this.getPathError(this.stack);
    }

    private getPathError(stack: string) {
        const stackLines = stack.split('\n');
        const stackLine = stackLines?.[1] || '';
        const [, path = ''] = stackLine.includes('(') ? stackLine.split(' (') : stackLine.split('at ');
        return path.replace(')', '').trim();
    }

    setReqId(requestId: string) {
        this.requestId = requestId;
    }
}
