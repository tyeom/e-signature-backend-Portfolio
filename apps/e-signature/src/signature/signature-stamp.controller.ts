import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  Put,
  UploadedFiles,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { QueryRunner } from '@app/common';
import { QueryRunner as QR } from 'typeorm';
import { TransactionInterceptor } from '@app/common';
import { CreateSignatureStampDto } from './dto/create-signature-stamp.dto';
import { UpdateSignatureStampDto } from './dto/update-signature-stamp.dto';
import { SignatureStampService } from './signature-stamp.service';

@Controller('signature-stamp')
// class-transformer의 @Exclude()등 어노테이션 적용
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class SignatureStampController {
  constructor(private readonly signatureStampService: SignatureStampService) {}

  @RBAC(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '선업로드 스탬프 이미지 파일',
    schema: {
      type: 'object',
      properties: {
        stampFiles: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('stampUpload')
  @UseInterceptors(
    FilesInterceptor('stampFiles', 5, {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (file.mimetype.includes('image') == false) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  stampUpload(@UploadedFiles() attachedFiles: Express.Multer.File[]) {
    const uploadFiles = attachedFiles.map((file) => ({
      fileName: file.filename,
    }));

    return uploadFiles;
  }

  @Post('create')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() createSignatureStampDto: CreateSignatureStampDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.signatureStampService.create(
      createSignatureStampDto,
      user,
      queryRunner,
    );
  }

  @Get()
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async findAll(@UserDecorator() user: User) {
    return await this.signatureStampService.findAll(user);
  }

  @Delete(':id')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: 'Stamp 삭제 완료',
  })
  @UseInterceptors(TransactionInterceptor)
  async removeSignatureStamp(
    @Param('id') id: number,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureStampService.removeSignatureStamp(
      +id,
      user,
      queryRunner,
    );
  }

  @Put(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async updateSignatureStamp(
    @Param('id') id: number,
    @Body() body: UpdateSignatureStampDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureStampService.updateSignatureStamp(
      +id,
      body,
      user,
      queryRunner,
    );
  }
}
