import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from 'src/common/enums/role-enum';
import { CreateTemplatesDto } from './dto/create-templates-dto';
import { User } from 'src/users/entities/user.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { GetRequesteeDto } from './dto/get-requestee-dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('templates')
@ApiBearerAuth()
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async getTemplates(
    @UserDecorator() user: User,
    @Query() dto: GetRequesteeDto,
  ) {
    return await this.templatesService.findAll(dto, user);
  }

  @Get(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async getTemplate(@Param('id') id: number, @UserDecorator() user: User) {
    return await this.templatesService.findOneById(id, user);
  }

  @Get(':id/detail')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async getTemplateDetail(
    @Param('id') id: number,
    @UserDecorator() user: User,
  ) {
    return await this.templatesService.findTemplatesDetail(id, user);
  }

  @Post('create')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async createTemplates(
    @Body() body: CreateTemplatesDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.templatesService.createTemplates(body, user, queryRunner);
  }

  @Put(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async updateTemplates(
    @Param('id') id: number,
    @Body() body: CreateTemplatesDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.templatesService.updateTemplate(
      id,
      body,
      user,
      queryRunner,
    );
  }

  @Delete(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async deleteTemplates(
    @Param('id') id: number,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.templatesService.deleteTemplates(id, user, queryRunner);
  }
}
