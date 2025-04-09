import { Module } from '@nestjs/common';
import { SignProcService } from './sign-proc.service';
import { SignProcController } from './sign-proc.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';
import { CertExtractorService } from './cert-extractor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignLog } from './entities/sign-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignLog]),
    MulterModule.register({
      storage: diskStorage({
        // process.cwd() + '/public' + '/temp'
        destination: join(process.cwd(), 'public', 'signPdf'),
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
  ],
  providers: [SignProcService, CertExtractorService],
  exports: [SignProcService],
  controllers: [SignProcController],
})
export class SignProcModule {}
