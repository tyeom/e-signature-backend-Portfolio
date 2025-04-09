export class PDFVerifyDto {
  /**
   * PDF 파일 위.변조 여부
   */
  forgery: boolean | null = null;

  /**
   * 싸인자
   */
  signer: string | null = null;

  /**
   * 인증서 유효성
   */
  certValidity: boolean | null = null;

  /**
   * 인증서 유효기간
   */
  certValidityPeriod: Date | null = null;

  /**
   * 검증 체크 시간 [서버 현재 시간]
   */
  verifyDate: Date = new Date();

  /**
   * 검증 오류 메세지
   */
  error: any;
}
