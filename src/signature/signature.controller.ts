import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from 'src/common/enums/role-enum';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { User } from 'src/users/entities/user.entity';
import { SignatureService } from './signature.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';

@Controller('signature')
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
        signatureFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('signatureUpload')
  @UseInterceptors(
    FileInterceptor('signatureFile', {
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
  signatureUpload(@UploadedFile() attachedFile: Express.Multer.File) {
    return {
      fileName: attachedFile.filename,
    };
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

  @Put('defaultSignature/:id')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: '기본 Signature 적용 완료, 적용한 Signature 정보 응답',
  })
  @UseInterceptors(TransactionInterceptor)
  async updateDefaultSignature(
    @Param('id') id: number,
    @UserDecorator() user: User,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.signatureService.updateDefaultSignature(+id, user, queryRunner);
  }

  @Get('defaultSignature')
  @RBAC(Role.USER)
  async getDefaultSignature(@UserDecorator() user: User) {
    return this.signatureService.getDefaultSignature(user);
  }
}
