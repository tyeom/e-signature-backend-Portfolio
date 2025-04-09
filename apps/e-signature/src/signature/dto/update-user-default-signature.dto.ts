import { BaseDto } from '../../base/dto';
import { Signature } from '../entities/signature.entity';

export class UpdateUserDefaultSignatureDto extends BaseDto {
  signature: Signature;
}
