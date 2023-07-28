import { Catch, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        response
            .code(exception.status)
            .send({
                message: exception.response.message.join(','),
                status: exception.status,
                time: new Date().toISOString(),
            })
    }
}