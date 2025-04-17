import { forwardRef, Module } from '@nestjs/common';
import { SignDocumentService } from './sign-document.service';
import { SignDocumentController } from './sign-document.controller';
import { SignProcModule } from '../sign-proc/sign-proc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignDocument } from './entities/sign-document.entity';
import { CommonModule } from '../common/common.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SignDocument]),
    SignProcModule,
    CommonModule,
    forwardRef(() => TemplatesModule),
  ],
  controllers: [SignDocumentController],
  providers: [SignDocumentService],
  exports: [SignDocumentService],
})
export class SignDocumentModule {}
