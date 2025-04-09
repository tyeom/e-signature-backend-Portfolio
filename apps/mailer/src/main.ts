import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SshTunnel } from '@app/common/ssh-tunnel';

async function bootstrap() {
  const serverOptions = {
    port: parseInt(process.env.DB_PORT || '5432'),
  };

  const sshOptions = {
    host: process.env.SSH_HOST || '',
    port: 22,
    username: process.env.SSH_USERNAME || '',
    password: process.env.SSH_PASSWORD || '',
  };

  const forwardOptions = {
    srcAddr: process.env.SSH_HOST || '',
    srcPort: parseInt(process.env.DB_PORT || '5432'),
    dstAddr: process.env.DB_HOST || '',
    dstPort: parseInt(process.env.DB_PORT || '5432'),
  };

  if (process.env.USE_SSH_TUNNEL === 'true') {
    const sshTunnelService = new SshTunnel(
      serverOptions,
      sshOptions,
      forwardOptions,
    );
    await sshTunnelService.createSSHTunnel();
  }

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.TCP_PORT ?? '3001'),
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
