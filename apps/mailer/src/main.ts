import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SshTunnel } from '@app/common/ssh-tunnel';
import { MAILER_SERVICE_QUEUE_NAME } from '@app/common/const';

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

  const useSSHTunnel = process.env.USE_SSH_TUNNEL === 'true';
  if (useSSHTunnel) {
    const sshTunnelService = new SshTunnel(
      serverOptions,
      sshOptions,
      forwardOptions,
    );
    await sshTunnelService.createSSHTunnel();
  }

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: MAILER_SERVICE_QUEUE_NAME,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
