import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MailTemplatesDetailDto } from './mail-templates-detail.dto';
import { BaseDto } from '../../base/dto';
import { User } from '../../entities/user.entity';

export class MailTemplatesDto extends BaseDto {
  /**
   * 라벨
   */
  @IsNotEmpty()
  @IsString()
  label: string;

  /**
   * 템플릿 정보
   */
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MailTemplatesDetailDto)
  templatesDetail: MailTemplatesDetailDto[];

  user: User;
}
