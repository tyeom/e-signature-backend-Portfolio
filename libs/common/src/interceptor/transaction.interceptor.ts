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
    const isHttp = context.getType() === 'http';
    const isRpc = context.getType() === 'rpc';

    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    // Http 요청이면 req에 queryRunner 추가
    if (isHttp) {
      const req = context.switchToHttp().getRequest<Request>();
      // Extend Request type to include queryRunner
      (req as Request & { queryRunner: any }).queryRunner = qr;
    }

    // RPC 요청이면 context.getArgByIndex(0) 사용
    if (isRpc) {
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const data = context.switchToRpc().getData();
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      // data.queryRunner = qr;

      Reflect.defineMetadata('QUERY_RUNNER', qr, context.getHandler());
    }

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
