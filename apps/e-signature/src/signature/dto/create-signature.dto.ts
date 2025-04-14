import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 서명 추가
 */
export class CreateSignatureDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '전체 이름',
    example: '',
  })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '단순 이름',
    example: '',
  })
  initials: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '선 업로드된 서명 파일 이름',
    example: '',
    isArray: true,
  })
  signatureImgs?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '선 업로드된 단순 이름 파일 이름',
    example: '',
    isArray: true,
  })
  initialsImgs?: string[];

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
