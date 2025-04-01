import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { SignDocumentService } from './sign-document.service';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from 'src/common/enums/role-enum';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

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
