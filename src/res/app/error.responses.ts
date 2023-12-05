import { ApiProperty } from '@nestjs/swagger';

export class AppErrorRes {
    @ApiProperty({ description: 'Mensagem de erro' })
    message: string;

    @ApiProperty({ description: 'Horário do erro' })
    timestamp: string;

    @ApiProperty({ description: 'Código do erro' })
    errorCode: string;
}
