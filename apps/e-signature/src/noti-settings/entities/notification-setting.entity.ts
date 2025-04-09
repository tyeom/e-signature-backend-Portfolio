import { BaseEntity } from '../../base/entities';
import { Column, Entity } from 'typeorm';

@Entity({ schema: 'esign' })
export class NotificationSetting extends BaseEntity {
  /**
   * 서명이 시작됨
   */
  @Column({ default: false })
  signingStarted: boolean;

  /**
   * 서명이 완료됨
   */
  @Column({ default: false })
  signingComplete: boolean;

  /**
   * 서명자가 서명을 거절함
   */
  @Column({ default: false })
  declineSignatures: boolean;

  /**
   * 서명자가 서명을 취소함
   */
  @Column({ default: false })
  canceledSignatures: boolean;

  /**
   * 서명 요청 취소함
   */
  @Column({ default: false })
  canceledSignatureReq: boolean;

  /**
   * 서명 요청할 차례
   */
  @Column({ default: false })
  turnForSignature: boolean;

  /**
   * 모든 서명 요청 알림 끄기
   */
  @Column({ default: false })
  disableNotiForSignatureReq: boolean;
}
