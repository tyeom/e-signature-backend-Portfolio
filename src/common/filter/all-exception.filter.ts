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
import { SshTunnelService } from 'src/ssh-tunnel/ssh-tunnel-service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly sshTunnelService: SshTunnelService,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    this.logger.error(
      // eslint-disable-next-line @typescript-eslint/no-unsaf
      // e-member-access, @typescript-eslint/no-unsafe-call
      `[Global Exception] ${request.method} ${request.url} => ${exception.toString()}`,
      exception,
      AllExceptionsFilter.name,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });

    // 개발 환경인 경우 SSH 터널 연결이 완료될 때까지 대기
    if (this.configService.get<boolean>('USE_SSH_TUNNEL') === true) {
      await this.sshTunnelService.createSSHTunnel();
    }
  }
}
