import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  Put,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SignDocumentService } from './sign-document.service';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { RBAC } from '@app/common/decorator';
import { QueryRunner, Role, TransactionInterceptor } from '@app/common';
import { QueryRunner as QR } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MailTemplatesDto } from './dto/mail-templates.dto';

@Controller('sign-document')
// class-transformer의 @Exclude()등 어노테이션 적용
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class SignDocumentController {
  constructor(private readonly signDocumentService: SignDocumentService) {}

  @Post('testPDFSign')
  @RBAC(Role.USER)
  async testPDFSign(
    @Body() createSignDocumentDto: CreateSignDocumentDto,
    @UserDecorator() user: User,
  ) {
    return await this.signDocumentService.testPDFSign(
      createSignDocumentDto,
      user,
    );
  }

  @Post('testSendBulkMail')
  @RBAC(Role.USER)
  async testSendBulkMail(
    @Body() testSendBulkMail: MailTemplatesDto,
    @UserDecorator() user: User,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.signDocumentService.testSendBulkMail(
      testSendBulkMail,
      user,
    );
  }

  @Post('create')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  createSignDocument(
    @Body() body: CreateSignDocumentDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signDocumentService.createSignDocument(body, user, queryRunner);
  }

  @Put(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async updateSignDocument(
    @Param('id') id: number,
    @Body() body: UpdateSignDocumentDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.signDocumentService.updateSignDocument(
      id,
      body,
      user,
      queryRunner,
    );
  }

  @Get(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async getSignDocument(@Param('id') id: number, @UserDecorator() user: User) {
    return await this.signDocumentService.findOneById(id, user);
  }

  @Get()
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async findOneByTemplatesId(
    @Query('templateId', ParseIntPipe) templateId: number,
    @UserDecorator() user: User,
  ) {
    return await this.signDocumentService.findOneByTemplatesId(
      templateId,
      user,
    );
  }
}
