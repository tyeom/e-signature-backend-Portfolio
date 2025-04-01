import { PartialType } from '@nestjs/mapped-types';
import { CreateSignDocumentDto } from './create-sign-document.dto';

export class UpdateSignDocumentDto extends PartialType(CreateSignDocumentDto) {}
