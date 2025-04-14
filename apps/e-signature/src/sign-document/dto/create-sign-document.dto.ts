import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * PDF 파일 서명
 */
export class CreateSignDocumentDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  pdfFile: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'PDF 파일 사용자 암호화 설정',
    example: '',
  })
  userPassword: string | null = null;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'PDF 파일 관리자 암호화 설정 (파일 권한 설정된 정보 무시 ex: 수정 금지, 복사 금지)',
    example: '',
  })
  ownerPassword: string | null = null;
}
