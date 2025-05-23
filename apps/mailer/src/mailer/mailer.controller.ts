import {
  Controller,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MailTemplatesDto } from './dto/mail-templates.dto';
import {
  AllExceptionsFilter,
  QueryRunner,
  TransactionInterceptor,
} from '@app/common';
import { QueryRunner as QR } from 'typeorm';

@Controller()
@UseFilters(AllExceptionsFilter)
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @MessagePattern({
    cmd: 'sendBulkMail',
  })
  // @UseFilters(AllExceptionsFilter) 로 오류 캐치 대체
  // @UseInterceptors(RpcInterceptor)
  @UseInterceptors(TransactionInterceptor)
  @UsePipes(ValidationPipe)
  async sendBulkMail(
    @Payload() mailTemplatesDto: MailTemplatesDto,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.mailerService.sendBulkMail(mailTemplatesDto, queryRunner);
  }
}
