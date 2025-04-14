import { BaseDto } from "../../base/dto";

/**
 * PDF 파일 서명 기록 생성
 */
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
