import { IsOptional, IsString } from 'class-validator';
import { PagePaginationDto } from 'src/common/dto/page-pagination.dto';

export class GetRequesteeDto extends PagePaginationDto {
  @IsOptional()
  @IsString()
  projectName: string;

  @IsOptional()
  @IsString()
  requestESignCreator: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}
