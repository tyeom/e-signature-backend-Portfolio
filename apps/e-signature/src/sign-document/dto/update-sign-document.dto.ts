import { PartialType } from '@nestjs/mapped-types';
import { CreateSignDocumentDto } from './create-sign-document.dto';
import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSignDocumentDto extends PartialType(CreateSignDocumentDto) {
  /**
   * 기타 첨부 파일 이름
   *
   * 이미지, 파일 등
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: '추가로 선 업로드된 기타 첨부 파일 이름',
    example: '["abc.pdf", "abc2.pdf"]',
    isArray: true,
  })
  addedAttachedFiles?: string[];
}
