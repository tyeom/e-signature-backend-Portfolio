import { BaseDto } from 'src/common/dto/base.dto';

export class CreateSignLogDto extends BaseDto {
  /**
   * 서명된 pdf 파일명
   */
  signedPdfFileName: string;

  /**
   * 서명된 pdf 시그니처 해시 값
   */
  signedDataDigest: string;
}
