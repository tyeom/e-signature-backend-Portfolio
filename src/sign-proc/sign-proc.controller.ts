import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from 'src/common/enums/role-enum';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { User } from 'src/users/entities/user.entity';
import { SignProcService } from './sign-proc.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('sign-proc')
@ApiBearerAuth()
export class SignProcController {
  constructor(readonly signProcService: SignProcService) {}

  @RBAC(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '선업로드 서명할 pdf 파일',
    schema: {
      type: 'object',
      properties: {
        attachedFile: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('signPDFUpload')
  @UseInterceptors(
    FileInterceptor('attachedFile', {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (file.mimetype.includes('pdf') == false) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  signPDFUpload(@UploadedFile() attachedFile: Express.Multer.File) {
    return {
      fileName: attachedFile.filename,
    };
  }

  @RBAC(Role.USER)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '서명을 검증할 pdf 파일',
    schema: {
      type: 'object',
      properties: {
        pdf: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      '검증 결과 상세 메세지 (검증 실패시 상세 메세지는 "error" 속성 참고)',
  })
  @ApiResponse({
    status: 500,
    description: '검증 실패 또는 검증 할 수 없는 파일',
  })
  @Post('verify')
  @UseInterceptors(
    FileInterceptor('pdf', {
      storage: memoryStorage(),
      // 파일 사이즈 제한
      limits: {
        fieldSize: 20000000,
      },
      fileFilter(req, file, callback) {
        // 01. 파일 형식 체크
        if (file.mimetype.includes('pdf') == false) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  async verify(
    @UploadedFile() attachedFile: Express.Multer.File,
    @UserDecorator() user: User,
  ) {
    return await this.signProcService.verify(attachedFile.buffer, user);
  }
}
