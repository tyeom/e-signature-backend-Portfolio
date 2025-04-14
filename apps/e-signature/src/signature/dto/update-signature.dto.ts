import { PartialType } from '@nestjs/mapped-types';
import { CreateSignatureDto } from './create-signature.dto';

/**
 * 서명 수정
 */
export class UpdateSignatureDto extends PartialType(CreateSignatureDto) {}
