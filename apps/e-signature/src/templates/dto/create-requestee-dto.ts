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
import { OmitType } from '@nestjs/mapped-types';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: '서명자 서명 순서',
    example: '1',
  })
  order: number;

  /**
   * 요청자 이름
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '요청자 이름',
    example: 'olobby',
  })
  name: string;

  /**
   * 이메일
   */
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: '이메일',
    example: 'user@olobby.co.kr',
  })
  email?: string;

  /**
   * SMS 번호
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'SMS 번호',
    example: '01012344321',
  })
  sms?: string;

  /**
   * 이메일 또는 SMS 사용 여부
   */
  @IsNotEmpty()
  @IsIn(['email', 'sms'])
  @ApiProperty({
    description: '이메일 또는 SMS 사용 여부 [email, sms]',
    example: 'email',
  })
  notificationMethod: 'email' | 'sms';

  /**
   * 알림 언어
   */
  @IsNotEmpty()
  @IsIn(['en', 'ko', 'jp', 'cn'])
  @ApiProperty({
    description: '알림 언어 [en, ko, jp, cn]',
    example: 'ko',
  })
  notificationLanguage: 'en' | 'ko' | 'jp' | 'cn';

  /**
   * 보안 코드
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '보안 코드',
    example: '',
  })
  securityCode?: string;

  /**
   * 보안 코드 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '보안 코드 사용 여부',
    example: 'true',
  })
  useSecurityCode: boolean;

  /**
   * 휴대폰 인증 번호
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '휴대폰 인증 번호',
    example: '01012344321',
  })
  phone?: string;

  /**
   * 휴대폰 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '휴대폰 인증 여부',
    example: 'true',
  })
  useCellphoneAuth: boolean;

  /**
   * 국가별 인증 필요 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '국가별 인증 필요 여부',
    example: 'true',
  })
  countrySpecificCert: boolean;

  /**
   * 카카오톡 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '카카오톡 인증 여부',
    example: 'true',
  })
  kakaoAuth: boolean;

  /**
   * 공인 인증 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '공인 인증 여부',
    example: 'true',
  })
  publicAuth: boolean;

  /**
   * 메시지
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '메세지',
    example: '',
  })
  message?: string;

  /**
   * 메시지 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '메세지 사용 여부',
    example: 'true',
  })
  useMessage: boolean;

  /**
   * 파일 첨부 사용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '파일 첨부 사용 여부',
    example: 'true',
  })
  useAttachFile: boolean;

  /**
   * 첨부 파일 (배열 형태)
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '첨부 파일',
    example: '["abc.pdf", "abc2.pdf"]',
    isArray: true,
  })
  attachedFiles?: string[];

  /**
   * 모든 요청자에게 동일한 옵션 적용 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '모든 요청자에게 동일한 옵션 적용 여부',
    example: 'true',
  })
  applySameOptions: boolean;
}
