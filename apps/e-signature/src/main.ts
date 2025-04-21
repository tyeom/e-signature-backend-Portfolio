import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SshTunnel } from '@app/common/ssh-tunnel';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

  const PORT = process.env.PORT || 8002;
  const app = await NestFactory.create(AppModule);
  const isDebugMode = process.env.NODE_ENV === 'development';
  // 디버그 모드인 경우 cors 모두 허용  [2025. 04. 21 엄태영]
  if (isDebugMode) {
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    console.log('Debug mode: CORS enabled for all origins');
  }

  const config = new DocumentBuilder()
    .setTitle('E-SIGNATURE')
    .setDescription('E-SIGNATURE APIs')
    .setVersion('1.0')
    .addBasicAuth()
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const swaggerJsonPath = join(process.cwd(), 'public', 'swagger.json');
  await writeFile(swaggerJsonPath, JSON.stringify(document));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.init();
  await app.listen(PORT);
  console.log(`http://localhost:${PORT}`);
}
bootstrap();
