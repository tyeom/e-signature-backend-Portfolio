import { Injectable } from '@nestjs/common';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { SignProcService } from 'src/sign-proc/sign-proc.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SignDocumentService {
  constructor(readonly signProcService: SignProcService) {}

  async testPDFSign(createSignDocumentDto: CreateSignDocumentDto, user: User) {
    return await this.signProcService.signByPDF(
      createSignDocumentDto.pdfFile,
      user,
      createSignDocumentDto.userPassword,
      createSignDocumentDto.ownerPassword,
    );
  }

  create(createSignDocumentDto: CreateSignDocumentDto) {
    return 'This action adds a new signDocument';
  }

  findAll() {
    return `This action returns all signDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signDocument`;
  }

  update(id: number, updateSignDocumentDto: UpdateSignDocumentDto) {
    return `This action updates a #${id} signDocument`;
  }
}
