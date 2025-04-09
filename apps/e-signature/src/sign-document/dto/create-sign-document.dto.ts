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
import { BaseDto } from '../../base/dto';

export class CreateSignDocumentDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  pdfFile: string;

  @IsOptional()
  @IsString()
  userPassword: string | null = null;

  @IsOptional()
  @IsString()
  ownerPassword: string | null = null;
}
