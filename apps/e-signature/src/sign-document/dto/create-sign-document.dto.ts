import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseDto } from '../../base/dto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

/**
 * PDF 파일 서명
 */
export class CreateSignDocumentDto extends BaseDto {
  /**
   * 템플릿 정보 Id
   */
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '템플릿 정보 Id',
    example: '[]',
  })
  templatesId: number;

  /**
   * 문서 편집 상태
   *
   * editing : 문서 편집중
   *
   * complete : 문서 편집 완료
   */
  @IsNotEmpty()
  @IsIn(['editing', 'complete'])
  @ApiProperty({
    description: '문서 편집 상태 [editing, complete]',
    example: 'editing',
  })
  editingStatus: 'editing' | 'complete' = 'editing';

  /**
   * 문서 상태
   *
   * requested : 문서 요청됨
   *
   * received : 문서 수신됨
   *
   * unknow : 문서 상태 알 수 없음
   */
  @IsOptional()
  @IsIn(['requested', 'received', 'unknow'])
  @ApiHideProperty()
  documentStatus: 'requested' | 'received' | 'unknow' = 'unknow';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'PDF 파일 사용자 암호화 설정',
    example: '',
  })
  pdfUserPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      'PDF 파일 관리자 암호화 설정 (파일 권한 설정된 정보 무시 ex: 수정 금지, 복사 금지)',
    example: '',
  })
  pdfOwnerPassword?: string;

  /**
   * 기타 첨부 파일 이름
   *
   * 이미지, 파일 등
   */
  @IsOptional()
  @IsArray()
  @ApiProperty({
    description:
      '선 업로드된 기타 첨부 파일 이름 **PUT 요청시에는 "addedAttachedFiles" 속성을 사용하세요!**',
    example: '["abc.pdf", "abc2.pdf"]',
    isArray: true,
  })
  attachedFiles?: string[];

  /**
   * 편집 완료된 최종 PDF 파일
   *
   * 아직 편집중인 경우 빈 값
   * 편집이 완료 되었다면 '/sign-proc/signPDFUpload' 로 pdf파일을 선 업로드 처리 후 반환되는 파일명 기입
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description:
      '선 업로드된 최종 편집된 파일 이름 [아직 편집중인 경우 null / 편집이 완료 되었다면 "/sign-proc/signPDFUpload" 로 pdf파일을 선 업로드 처리 후 반환되는 파일명 기입]',
    example: 'Edited.pdf',
  })
  editedFile?: string;

  /**
   * 객체 정보 [JSON]
   *
   * 서명 / 객체 위치, 사이즈 등
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '객체 정보 [JSON]',
    example: '',
  })
  documentBlob?: string;

  /**
   * 기타 문서 정보 01
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '기타 문서 정보 01',
    example: 'Edited.pdf',
    isArray: true,
  })
  documentInfo1?: string;

  /**
   * 기타 문서 정보 02
   */
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '기타 문서 정보 02',
    example: 'Edited.pdf',
    isArray: true,
  })
  documentInfo2?: string;
}
