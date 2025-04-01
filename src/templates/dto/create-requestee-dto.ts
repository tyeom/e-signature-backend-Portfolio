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
import { Type } from 'class-transformer';
import { BaseDto } from 'src/common/dto/base.dto';
import { OmitType } from '@nestjs/mapped-types';

// BaseDto 모든 속성
// const allBaseDtoProperties = Object.keys(new BaseDto()) as (keyof BaseDto)[];
/**
 * export class CreateTemplatesDto extends OmitType(BaseDto, allBaseDtoProperties) {}
 */

// BaseDto의 속성은 클라이언트 DTO에서 제외
export class CreateRequesteeDto extends BaseDto {
  /**
   * 서명자 서명 순서
   */
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  order: number;

  /**
   * 요청자 이름
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 이메일
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /**
   * SMS 번호
   */
  @IsOptional()
  @IsString()
  sms?: string;

  /**
   * 이메일 또는 SMS 사용 여부
   */
  @IsNotEmpty()
  @IsIn(['email', 'sms'])
  notificationMethod: 'email' | 'sms';

  /**
   * 알림 언어
   */
  @IsNotEmpty()
  @IsIn(['en', 'ko', 'jp', 'cn'])
  notificationLanguage: 'en' | 'ko' | 'jp' | 'cn';

  /**
   * 보안 코드
   */
  @IsOptional()
  @IsString()
  securityCode?: string;

  /**
   * 보안 코드 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  useSecurityCode: boolean;

  /**
   * 휴대폰 인증 번호
   */
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * 휴대폰 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  useCellphoneAuth: boolean;

  /**
   * 국가별 인증 필요 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  countrySpecificCert: boolean;

  /**
   * 카카오톡 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  kakaoAuth: boolean;

  /**
   * 공인 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  publicAuth: boolean;

  /**
   * 메시지
   */
  @IsOptional()
  @IsString()
  message?: string;

  /**
   * 메시지 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  useMessage: boolean;

  /**
   * 파일 첨부 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  useAttachFile: boolean;

  /**
   * 첨부 파일 (배열 형태)
   */
  @IsOptional()
  @IsArray()
  attachedFiles?: string[];

  /**
   * 모든 요청자에게 동일한 옵션 적용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  applySameOptions: boolean;
}
