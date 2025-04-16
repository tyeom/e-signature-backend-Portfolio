import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SignatureStamp } from '../entities/signature-stamp.entity';
import { Signature } from '../entities/signature.entity';

export class UpdateUserDefaultSignatureDto extends BaseDto {
  /**
   * 시그니처 정보 id
   */
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '시그니처 또는 스탬프 정보 id',
    example: '17',
  })
  id: number;

  /**
   * 기본으로 설정되는 것이 시그니처인지 스탬프인지 구분
   */
  @IsNotEmpty()
  @IsIn(['signature', 'stamp'], {
    message: "type은 'signature' 또는 'stamp'만 허용됩니다",
  })
  @IsString()
  @ApiProperty({
    description: '구분 값',
    example: 'signature',
  })
  type: 'signature' | 'stamp';

  @Exclude()
  signature: Signature;

  @Exclude()
  stamp: SignatureStamp;
}
