import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRequesteeDto } from './create-requestee-dto';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { BaseDto } from '../../base/dto';

// BaseDto 모든 속성
// const allBaseDtoProperties = Object.keys(new BaseDto()) as (keyof BaseDto)[];
/**
 * export class CreateTemplatesDto extends OmitType(BaseDto, allBaseDtoProperties) {}
 */

export class CreateTemplatesDto extends BaseDto {
  /**
   * 프로젝트 이름
   */
  @IsNotEmpty()
  @IsString()
  projectName: string;

  /**
   * 문서 이름
   */
  @IsNotEmpty()
  @IsString()
  documentName: string;

  /**
   * 만료일
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  expireDate: Date;

  /**
   * 나에게 서명 요청하기
   */
  @IsNotEmpty()
  @IsBoolean()
  requestSignatureForMe: boolean;

  /**
   * 예약 전송
   */
  @IsNotEmpty()
  @IsBoolean()
  scheduledSend: boolean;

  /**
   * 예약 전송 날짜
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledSendDate?: Date;

  /**
   * 서명자가 문서를 편집 가능 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  allowDocumentEditing: boolean;

  /**
   * 서명 순서 강제 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  mustSignInOrder: boolean;

  /**
   * 참여자 (userIds)
   */
  @IsOptional()
  @IsArray()
  teammates?: number[];

  /**
   * 요청자 리스트
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequesteeDto)
  requestee?: CreateRequesteeDto[];
}
