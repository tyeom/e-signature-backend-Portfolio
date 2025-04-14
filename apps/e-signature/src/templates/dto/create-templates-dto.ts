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
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    description: '프로젝트 이름',
    example: '',
  })
  projectName: string;

  /**
   * 문서 이름
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '문서 이름',
    example: '',
  })
  documentName: string;

  /**
   * 만료일
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: '만료일',
    example: '',
  })
  expireDate: Date;

  /**
   * 나에게 서명 요청하기
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '나에게 서명 요청하기',
    example: 'false',
  })
  requestSignatureForMe: boolean;

  /**
   * 예약 전송
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '예약 전송',
    example: 'false',
  })
  scheduledSend: boolean;

  /**
   * 예약 전송 날짜
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: '예약 전송 날짜',
    example: '',
  })
  scheduledSendDate?: Date;

  /**
   * 서명자가 문서를 편집 가능 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '서명자가 문서를 편집 가능 여부',
    example: 'false',
  })
  allowDocumentEditing: boolean;

  /**
   * 서명 순서 강제 여부
   */
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: '서명 순서 강제 여부',
    example: 'true',
  })
  mustSignInOrder: boolean;

  /**
   * 참여자 (userIds)
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '참여자 User ids',
    isArray: true,
    example: '[1, 2, 3]',
  })
  teammates?: number[];

  /**
   * 요청자 리스트
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequesteeDto)
  @ApiProperty({
    description: '요청자 리스트',
    type: () => CreateRequesteeDto,
    isArray: true,
    example: '[]',
  })
  requestee?: CreateRequesteeDto[];
}
