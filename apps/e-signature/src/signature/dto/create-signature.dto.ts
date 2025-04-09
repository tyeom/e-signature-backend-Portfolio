import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../base/dto';

export class CreateSignatureDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  initials: string;

  @IsOptional()
  @IsString()
  signatureImg?: string;
}
