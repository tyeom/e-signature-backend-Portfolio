import { IsOptional, IsString } from 'class-validator';
import { PagePaginationDto } from '../../base/dto';

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
