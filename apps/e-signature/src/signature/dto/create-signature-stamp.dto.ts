import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 스탬프 추가
 */
export class CreateSignatureStampDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '스탬프 이름',
    example: '법인 도장',
  })
  stampName: string;

  @IsOptional()
  @IsIn(['general', 'corporate'], {
    message: "stampType은 'general' 또는 'corporate'만 허용됩니다",
  })
  @ApiProperty({
    description: '타입 [일반/법인]',
    example: 'corporate',
  })
  stampType: 'general' | 'corporate';

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '선 업로드된 스탬프 파일 이름',
    example: '',
    isArray: true,
  })
  stampImgs?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '스탬프 높이',
    example: '15mm',
  })
  stampHeight: string;

  /**
   * 이용 가능 맴버 (userIds)
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '이용 가능 맴버 User ids',
    isArray: true,
    example: '[1, 2, 3]',
  })
  teammates?: number[];
}
