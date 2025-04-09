import { Inject, Injectable } from '@nestjs/common';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { SignProcService } from '../sign-proc/sign-proc.service';
import { User } from '../users/entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';
import { MAILER_SERVICE } from '@app/common/const';
import { MailTemplatesDto } from './dto/mail-templates.dto';
import { DtoBuilder } from '../base/dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class SignDocumentService {
  constructor(
    private readonly signProcService: SignProcService,
    @Inject(MAILER_SERVICE)
    private readonly maillerMicroservice: ClientProxy,
  ) {}

  async testPDFSign(createSignDocumentDto: CreateSignDocumentDto, user: User) {
    return await this.signProcService.signByPDF(
      createSignDocumentDto.pdfFile,
      user,
      createSignDocumentDto.userPassword,
      createSignDocumentDto.ownerPassword,
    );
  }

  async testSendBulkMail(testSendBulkMail: MailTemplatesDto, user: User) {
    testSendBulkMail.user = user;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await lastValueFrom(
      this.maillerMicroservice.send({ cmd: 'sendBulkMail' }, testSendBulkMail),
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
  }

  create(createSignDocumentDto: CreateSignDocumentDto) {
    return 'This action adds a new signDocument';
  }

  findAll() {
    return `This action returns all signDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signDocument`;
  }

  update(id: number, updateSignDocumentDto: UpdateSignDocumentDto) {
    return `This action updates a #${id} signDocument`;
  }
}
