
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
    private readonly logger = new Logger(WrapResponseInterceptor.name);
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const now = Date.now();
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest()
        return next.handle().pipe(map((data) => {
            const responseTime = Date.now() - now;
            this.logger.log(`[${request.method}][${response.statusCode}] ${request.url} - ${responseTime}ms`);
            return { status: response.statusCode, data };
        }));
    }
}
