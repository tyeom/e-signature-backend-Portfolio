import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest<Request>();
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();
    // Extend Request type to include queryRunner
    (req as Request & { queryRunner: any }).queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();

        throw e;
      }),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
