import { IsBoolean, IsDefined } from 'class-validator';
import { BaseDto } from '../../base/dto';

export class CreateSettingDto extends BaseDto {
  /**
   * 서명이 시작됨
   */
  @IsDefined()
  @IsBoolean()
  signingStarted: boolean;

  /**
   * 서명이 완료됨
   */
  @IsDefined()
  @IsBoolean()
  signingComplete: boolean;

  /**
   * 서명자가 서명을 거절함
   */
  @IsDefined()
  @IsBoolean()
  declineSignatures: boolean;

  /**
   * 서명자가 서명을 취소함
   */
  @IsDefined()
  @IsBoolean()
  canceledSignatures: boolean;

  /**
   * 서명 요청 취소함
   */
  @IsDefined()
  @IsBoolean()
  canceledSignatureReq: boolean;

  /**
   * 서명 요청할 차례
   */
  @IsDefined()
  @IsBoolean()
  turnForSignature: boolean;

  /**
   * 모든 서명 요청 알림 끄기
   */
  @IsDefined()
  @IsBoolean()
  disableNotiForSignatureReq: boolean;
}
