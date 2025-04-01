import { Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestESign } from 'src/templates/entities/request-sign.entity';
import { Requestee } from 'src/templates/entities/requestee.entity';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // process.cwd() + '/public' + '/temp'
        destination: join(process.cwd(), 'public', 'temp'),
        filename: (req, file, cb) => {
          const split = file.originalname.split('.');

          let extension;

          if (split.length > 1) {
            extension = split[split.length - 1];
          }

          cb(null, `${v4()}_${Date.now()}.${extension}`);
        },
      }),
    }),
    // TypeOrmModule.forFeature([RequestESign, Requestee]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
