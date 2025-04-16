import {
  Body,
  ClassSerializerInterceptor,
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
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
import { CreateTemplatesDto } from './dto/create-templates-dto';
import { User } from '../users/entities/user.entity';
import { TransactionInterceptor } from '@app/common';
import { QueryRunner } from '@app/common';
import { QueryRunner as QR } from 'typeorm';
import { GetRequesteeDto } from './dto/get-requestee-dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('templates')
// class-transformer의 @Exclude()등 어노테이션 적용
@UseInterceptors(ClassSerializerInterceptor)
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
