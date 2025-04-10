import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SshTunnel } from '@app/common/ssh-tunnel';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE_QUEUE_NAME } from '@app/common/const';

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
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: NOTIFICATION_SERVICE_QUEUE_NAME,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
