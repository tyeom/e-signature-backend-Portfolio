import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SshTunnel } from '../ssh-tunnel';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const isHttp = host.getType() === 'http';
    const isRpc = host.getType() === 'rpc';

    if (isHttp) {
      const ctx = host.switchToHttp();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = ctx.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = ctx.getRequest();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(
        // e-member-access, @typescript-eslint/no-unsafe-call
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        `[Global Exception] ${request.method} ${request.url} => ${exception.toString()}`,
        exception,
        AllExceptionsFilter.name,
      );

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      response.status(status).json({
        success: false,
        statusCode: status,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
    }

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

    if (isRpc) {
      this.logger.error(
        // e-member-access, @typescript-eslint/no-unsafe-call
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        `[Global RpcException] ${exception.toString()}`,
        exception,
        AllExceptionsFilter.name,
      );

      return throwError(
        () =>
          new RpcException({
            success: false,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            message: exception.message,
            timestamp: new Date().toISOString(),
          }),
      );
    }
  }
}
