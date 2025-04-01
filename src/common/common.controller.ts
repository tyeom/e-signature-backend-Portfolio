import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from './enums/role-enum';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('common')
@ApiBearerAuth()
export class CommonController {
  @RBAC(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '선 업로드할 파일',
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
  @Post('fileUpload')
  @UseInterceptors(
    FileInterceptor('attachedFile', {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (file.mimetype.includes('officedocument') == false) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  fileUpload(@UploadedFile() attachedFile: Express.Multer.File) {
    return {
      fileName: attachedFile.filename,
    };
  }
}
