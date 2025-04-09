import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../base/dto';

export class MailTemplatesDetailDto extends BaseDto {
  /**
   * 번호
   */
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  order: number;

  /**
   * 문서명
   */
  @IsNotEmpty()
  @IsString()
  documentName: string;

  /**
   * 서명자 이름
   */
  @IsNotEmpty()
  @IsString()
  signatoryName: string;

  /**
   * 이메일 또는 전화번호
   */
  @IsNotEmpty()
  @IsString()
  emailOrPhone: string;

  /**
   * 사용자 언어
   */
  @IsNotEmpty()
  @IsString()
  userLang: 'en' | 'ko';

  /**
   * 남길 말
   */
  @IsOptional()
  @IsString()
  comment?: string;

  /**
   * 접근 암호
   */
  @IsOptional()
  @IsString()
  password?: string;

  /**
   * 암호 힌트
   */
  @IsOptional()
  @IsString()
  passwordHint?: string;
}
