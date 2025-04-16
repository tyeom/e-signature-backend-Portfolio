import { IsOptional, IsString } from 'class-validator';
import { PagePaginationDto } from '../../base/dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetRequesteeDto extends PagePaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '프로젝트 이름으로 조회',
    example: '',
  })
  projectName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '사용자 이름으로 검색',
    example: '',
  })
  requestESignCreator: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '서명 상태로 검색',
    example: '',
  })
  status: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '생성 날짜로 검색 [시작 날짜]',
    example: '',
  })
  startDate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '생성 날짜로 검색 [종료 날짜]',
    example: '',
  })
  endDate: string;
}
