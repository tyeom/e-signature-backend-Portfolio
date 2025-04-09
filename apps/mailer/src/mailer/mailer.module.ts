import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplates } from './entities/mail-templates.entity';
import { MailTemplatesDetail } from './entities/mail-templates-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailTemplates, MailTemplatesDetail])],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
