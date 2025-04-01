import { Module } from '@nestjs/common';
import { SignDocumentService } from './sign-document.service';
import { SignDocumentController } from './sign-document.controller';
import { SignProcModule } from 'src/sign-proc/sign-proc.module';

@Module({
  imports: [SignProcModule],
  controllers: [SignDocumentController],
  providers: [SignDocumentService],
})
export class SignDocumentModule {}
