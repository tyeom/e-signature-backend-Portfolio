import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MailTemplatesDto } from './dto/mail-templates.dto';
import { QueryRunner } from 'typeorm';
import { MailTemplates } from './entities/mail-templates.entity';
import { DtoBuilder } from '../base/dto';
import { MailTemplatesDetailDto } from './dto/mail-templates-detail.dto';
import { MailTemplatesDetail } from './entities/mail-templates-detail.entity';

@Injectable()
export class MailerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async sendBulkMail(mailTemplatesDto: MailTemplatesDto, qr: QueryRunner) {
    this.logger.log('대량 메일 전송 시작!', MailerService.name);

    // DB INSERT
    const saveMailTemplatesDto = DtoBuilder.save(
      MailTemplatesDto,
      mailTemplatesDto,
      mailTemplatesDto.user,
    );

    const mailTemplates = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(MailTemplates)
      .values(saveMailTemplatesDto)
      .execute();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mailTemplatesId = mailTemplates.identifiers[0].id;

    // templatesDetail INSERT
    if (mailTemplatesDto.templatesDetail) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, value] of mailTemplatesDto.templatesDetail.entries()) {
        const saveMailTemplatesDetailDto = DtoBuilder.save(
          MailTemplatesDetailDto,
          value,
          mailTemplatesDto.user,
        );

        await qr.manager
          .createQueryBuilder()
          .insert()
          .into(MailTemplatesDetail)
          .values({
            ...saveMailTemplatesDetailDto,
            mailTemplates: { id: +mailTemplatesId },
          })
          .execute();
      }
    }

    return await qr.manager.findOne(MailTemplates, {
      where: {
        id: +mailTemplatesId,
      },
      relations: ['templatesDetail'],
    });
  }
}
