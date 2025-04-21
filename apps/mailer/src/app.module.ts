import { Module } from '@nestjs/common';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@app/common';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { MailTemplates } from './mailer/entities/mail-templates.entity';
import { MailTemplatesDetail } from './mailer/entities/mail-templates-detail.entity';
import DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'mailer', '.env'),
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        DB_TYPE: Joi.string().valid('postgres').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        USE_SSH_TUNNEL: Joi.boolean().required(),
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
          entities: [User, MailTemplates, MailTemplatesDetail],
          logging: true,
          logger: 'advanced-console',
        };
      },
      inject: [ConfigService],
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

        // new winston.transports.File({
        //   dirname: join(process.cwd(), 'apps', 'mailer', 'logs'),
        //   filename: 'mailer.log',
        //   format: winston.format.combine(
        //     winston.format.timestamp(),
        //     winston.format.printf(
        //       (info) =>
        //         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        //         `${info.timestamp} [${info.context}] [${info.level}] ${info.message}`,
        //     ),
        //   ),
        // }),

        // 일별 로그 파일 설정
        new DailyRotateFile({
          dirname: join(process.cwd(), 'apps', 'mailer', 'logs'),
          filename: 'mailer.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
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
    MailerModule,
  ],
  providers: [
    /// TODO : 이상하게 전역으로 AllRpcExceptionsFilter가 동작하지 않음
    /// TODO : 그래서 각 컨트롤러에 @UseFilters(AllRpcExceptionsFilter) 로 처리
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
