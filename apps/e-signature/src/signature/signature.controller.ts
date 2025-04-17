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
  Patch,
  Query,
  ParseIntPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { User } from '../users/entities/user.entity';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { QueryRunner } from '@app/common';
import { QueryRunner as QR } from 'typeorm';
import { TransactionInterceptor } from '@app/common';
import { UpdateSignatureDto } from './dto/update-signature.dto';

@Controller('signature')
// class-transformer의 @Exclude()등 어노테이션 적용
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @RBAC(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '선업로드 서명 이미지 파일',
    schema: {
      type: 'object',
      properties: {
        signatureFiles: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('signatureUpload')
  @UseInterceptors(
    FilesInterceptor('signatureFiles', 5, {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (file.mimetype.includes('png') == false) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  async signatureUpload(@UploadedFiles() attachedFiles: Express.Multer.File[]) {
    // 이미지 배경 제거 처리
    await this.signatureService.rembgProc(
      attachedFiles.map((file) => file.filename),
    );

    const uploadFiles = attachedFiles.map((file) => ({
      fileName: file.filename,
    }));

    return uploadFiles;
  }

  @Post('create')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async create(
    @Body() createSignatureDto: CreateSignatureDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return await this.signatureService.create(
      createSignatureDto,
      user,
      queryRunner,
    );
  }

  @Get()
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async findAll(@UserDecorator() user: User) {
    return await this.signatureService.findAll(user);
  }

  /**
   * Signature와 Stamp 전체 데이터 조회
   * @param user 요청된 사용자 정보
   * @returns Signature와 Stamp 전체 데이터
   */
  @Get('all')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async findAllBySignature_Stamp(@UserDecorator() user: User) {
    return await this.signatureService.findAllBySignature_Stamp(user);
  }

  @Delete(':id')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: 'Signature 삭제 완료',
  })
  @UseInterceptors(TransactionInterceptor)
  async removeSignature(
    @Param('id') id: number,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureService.removeSignature(+id, user, queryRunner);
  }

  @Put(':id')
  @RBAC(Role.USER)
  @UseInterceptors(TransactionInterceptor)
  async updateSignature(
    @Param('id') id: number,
    @Body() body: UpdateSignatureDto,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureService.updateSignature(+id, body, user, queryRunner);
  }

  @Patch('defaultSignature')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: '기본 Signature 적용 완료, 적용한 Signature 정보 응답',
  })
  @UseInterceptors(TransactionInterceptor)
  async updateDefaultSignature(
    @Query('id', ParseIntPipe) id: number,
    @Query('type') type: string,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureService.updateDefaultSignature(
      id,
      type,
      user,
      queryRunner,
    );
  }

  @Get('defaultSignature')
  @RBAC(Role.USER)
  async getDefaultSignature(@UserDecorator() user: User) {
    return this.signatureService.getDefaultSignature(user);
  }
}
