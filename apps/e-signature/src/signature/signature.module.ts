import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from 'uuid';
import { Signature } from './entities/signature.entity';
import { UserDefaultSignature } from './entities/user-default-signature.entity';
import { SignatureStamp } from './entities/signature-stamp.entity';
import { SignatureStampController } from './signature-stamp.controller';
import { SignatureStampService } from './signature-stamp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Signature, SignatureStamp, UserDefaultSignature]),
    MulterModule.register({
      storage: diskStorage({
        // process.cwd() + '/public' + '/temp'
        destination: join(process.cwd(), 'public', 'signature'),
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
  controllers: [SignatureController, SignatureStampController],
  providers: [SignatureService, SignatureStampService],
})
export class SignatureModule {}
