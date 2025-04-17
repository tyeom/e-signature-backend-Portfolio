import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
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
        attachedFiles: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('filesUpload')
  @UseInterceptors(
    FilesInterceptor('attachedFiles', 10, {
      limits: {
        fileSize: 20000000,
      },
      fileFilter(req, file, callback) {
        if (
          file.mimetype.includes('officedocument') == false &&
          file.mimetype.includes('pdf') == false
        ) {
          return callback(
            new BadRequestException('지원하지 않은 파일 형식 입니다.'),
            false,
          );
        }

        return callback(null, true);
      },
    }),
  )
  fileUpload(@UploadedFiles() attachedFiles: Express.Multer.File[]) {
    const uploadFiles = attachedFiles.map((file) => ({
      fileName: file.filename,
    }));

    return uploadFiles;
  }
}
