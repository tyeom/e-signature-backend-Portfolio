import { PartialType } from '@nestjs/mapped-types';
import { CreateSignatureStampDto } from './create-signature-stamp.dto';

/**
 * 스탬프 수정
 */
export class UpdateSignatureStampDto extends PartialType(
  CreateSignatureStampDto,
) {}
