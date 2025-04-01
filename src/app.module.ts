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
import { SshTunnelService } from './ssh-tunnel/ssh-tunnel-service';
import { SshTunnelModule } from './ssh-tunnel/ssh-tunnel.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { AllExceptionsFilter } from './common/filter/all-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BearerTokenMiddleware } from './authentication/middleware/bearer-token.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthGuard } from './authentication/guard/auth.guard';
import { RBACGuard } from './authentication/guard/rbac.guard';
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

@Module({
  imports: [
    ConfigModule.forRoot({
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
    SshTunnelModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SshTunnelModule],
      useFactory: async (
        configService: ConfigService,
        sshTunnelService: SshTunnelService,
      ) => {
        // 개발 환경인 경우 SSH 터널 연결이 완료될 때까지 대기
        if (configService.get<boolean>('USE_SSH_TUNNEL') === true) {
          await sshTunnelService.createSSHTunnel();
          console.log('SSH 터널링 연결 완료!');
        }

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
        };
      },
      inject: [ConfigService, SshTunnelService],
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
          dirname: join(process.cwd(), 'logs'),
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
  ],
  providers: [
    SshTunnelService,
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
