import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { SignDocumentService } from './sign-document.service';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MailTemplatesDto } from './dto/mail-templates.dto';

@Controller('sign-document')
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

  @Post()
  @RBAC(Role.USER)
  create(@Body() createSignDocumentDto: CreateSignDocumentDto) {
    return this.signDocumentService.create(createSignDocumentDto);
  }

  @Get()
  @RBAC(Role.USER)
  findAll() {
    return this.signDocumentService.findAll();
  }

  @Get(':id')
  @RBAC(Role.USER)
  findOne(@Param('id') id: string) {
    return this.signDocumentService.findOne(+id);
  }

  @Patch(':id')
  @RBAC(Role.USER)
  update(
    @Param('id') id: string,
    @Body() updateSignDocumentDto: UpdateSignDocumentDto,
  ) {
    return this.signDocumentService.update(+id, updateSignDocumentDto);
  }
}
