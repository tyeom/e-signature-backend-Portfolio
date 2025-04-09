import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, throwError } from 'rxjs';
import { SshTunnel } from '../ssh-tunnel';

export class RpcInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        const resp = {
          status: 'success',
          data,
        };
        console.log(resp);

        return resp;
      }),
      catchError(async (error) => {
        const resp = {
          status: 'error',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error: error,
        };
        console.log(resp);

        // SSH Tunnel 다시 연결
        const serverOptions = {
          port: parseInt(this.configService.get('DB_PORT') || '5432'),
        };

        const sshOptions = {
          host: this.configService.get<string>('SSH_HOST') || '',
          port: 22,
          username: this.configService.get<string>('SSH_USERNAME') || '',
          password: this.configService.get<string>('SSH_PASSWORD') || '',
        };

        const forwardOptions = {
          srcAddr: this.configService.get<string>('SSH_HOST') || '',
          srcPort: parseInt(this.configService.get('DB_PORT') || '5432'),
          dstAddr: this.configService.get<string>('DB_HOST') || '',
          dstPort: parseInt(this.configService.get('DB_PORT') || '5432'),
        };

        if (this.configService.get<boolean>('USE_SSH_TUNNEL') === true) {
          const sshTunnelService = new SshTunnel(
            serverOptions,
            sshOptions,
            forwardOptions,
          );
          await sshTunnelService.createSSHTunnel();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return throwError(() => new RpcException(error));
      }),
    );
  }
}
