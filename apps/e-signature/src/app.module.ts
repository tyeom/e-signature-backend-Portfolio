import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesModule } from './templates/templates.module';
import { TeammateModule } from './teammate/teammate.module';
import { User } from './users/entities/user.entity';
import { RequestESign } from './templates/entities/request-sign.entity';
import { Requestee } from './templates/entities/requestee.entity';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { AllExceptionsFilter } from '@app/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BearerTokenMiddleware } from './authentication/middleware/bearer-token.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthGuard, RBACGuard } from '@app/common/guard';
import { NotiSettingsModule } from './noti-settings/noti-settings.module';
import { NotificationSetting } from './noti-settings/entities/notification-setting.entity';
import { SignProcModule } from './sign-proc/sign-proc.module';
import { SignDocumentModule } from './sign-document/sign-document.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { SignLog } from './sign-proc/entities/sign-log.entity';
import { SignatureModule } from './signature/signature.module';
import { Signature } from './signature/entities/signature.entity';
import { UserDefaultSignature } from './signature/entities/user-default-signature.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MAILER_SERVICE,
  MAILER_SERVICE_QUEUE_NAME,
  NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_QUEUE_NAME,
} from '@app/common/const';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'e-signature', '.env'),
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        USE_S3_STORAGE: Joi.boolean().required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        USE_SSH_TUNNEL: Joi.boolean().required(),
        P12_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE') as 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT') || '5432'),
          username: configService.get('DB_USERNAME') || '',
          password: configService.get('DB_PASSWORD') || '',
          database: process.env.DB_DATABASE || '',
          entities: [
            User,
            RequestESign,
            Requestee,
            NotificationSetting,
            SignLog,
            Signature,
            UserDefaultSignature,
          ],
          logging: true,
          logger: 'advanced-console',
        };
      },
      inject: [ConfigService],
    }),
    // 서버 로컬 다운로드 경로 설정
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/storage/',
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      // debug 이상 레벨만 display
      level: 'debug',
      transports: [
        // Console log
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp(),
            winston.format.printf(
              (info) =>
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${info.timestamp} [${info.context}] [${info.level}] ${info.message}`,
            ),
          ),
        }),
        new winston.transports.File({
          dirname: join(process.cwd(), 'apps', 'e-signature', 'logs'),
          filename: 'e-signature.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(
              (info) =>
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${info.timestamp} [${info.context}] [${info.level}] ${info.message}`,
            ),
          ),
        }),
      ],
    }),
    TemplatesModule,
    TeammateModule,
    AuthenticationModule,
    UsersModule,
    NotiSettingsModule,
    SignProcModule,
    SignDocumentModule,
    SignatureModule,

    // Microservice 모듈 등록
    ClientsModule.registerAsync({
      clients: [
        {
          name: MAILER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: MAILER_SERVICE_QUEUE_NAME,
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },
        {
          name: NOTIFICATION_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: ['amqp://rabbitmq:5672'],
              queue: NOTIFICATION_SERVICE_QUEUE_NAME,
              queueOptions: {
                durable: true,
              },
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BearerTokenMiddleware)
      .exclude({
        path: 'authentication/sign-in',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
