import { BaseDto } from 'src/common/dto/base.dto';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';

export class CreateSignDocumentDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  pdfFile: string;
}
