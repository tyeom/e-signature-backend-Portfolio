import { forwardRef, Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestESign } from './entities/request-sign.entity';
import { Requestee } from './entities/requestee.entity';
import { CommonModule } from '../common/common.module';
import { SignDocumentModule } from '../sign-document/sign-document.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestESign, Requestee]),
    CommonModule,
    forwardRef(() => SignDocumentModule),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
