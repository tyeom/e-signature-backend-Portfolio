import { Entity, Column, ManyToOne } from 'typeorm';
import { RequestESign } from './request-sign.entity';
import { BaseEntity } from '../../base/entities';

/**
 * 서명 요청 대상자
 */
@Entity({ schema: 'esign' })
export class Requestee extends BaseEntity {
  /**
   * 서명 요청 ID (외래키)
   */
  @ManyToOne(() => RequestESign, (requestESign) => requestESign.requestees, {
    onDelete: 'CASCADE',
  })
  requestESign: RequestESign;

  /**
   * 서명자 서명 순서
   */
  @Column()
  order: number;

  /**
   * 요청자 이름
   */
  @Column()
  name: string;

  /**
   * 이메일
   */
  @Column({ nullable: true })
  email: string;

  /**
   * SMS 번호
   */
  @Column({ nullable: true })
  sms: string;

  /**
   * 이메일 또는 SMS 사용 여부
   */
  @Column({ default: 'email' }) // 'email' | 'sms'
  notificationMethod: 'email' | 'sms';

  /**
   * 알림 언어
   */
  @Column({ default: 'en' }) // 기본 영어
  notificationLanguage: 'en' | 'ko' | 'jp' | 'cn';

  /**
   * 보안 코드
   */
  @Column({ nullable: true })
  securityCode: string;

  /**
   * 보안 코드 사용 여부
   */
  @Column({ default: false })
  useSecurityCode: boolean;

  /**
   * 휴대폰 인증 번호
   */
  @Column({ nullable: true })
  phone: string;

  /**
   * 휴대폰 인증 여부
   */
  @Column({ default: false })
  useCellphoneAuth: boolean;

  /**
   * 국가별 인증 필요 여부
   */
  @Column({ default: false })
  countrySpecificCert: boolean;

  /**
   * 카카오톡 인증 여부
   */
  @Column({ default: false })
  kakaoAuth: boolean;

  /**
   * 공인 인증 여부
   */
  @Column({ default: false })
  publicAuth: boolean;

  /**
   * 메시지
   */
  @Column({ nullable: true })
  message: string;

  /**
   * 메시지 사용 여부
   */
  @Column({ default: false })
  useMessage: boolean;

  /**
   * 파일 첨부 사용 여부
   */
  @Column({ default: false })
  useAttachFile: boolean;

  /**
   * 첨부 파일 (배열 형태)
   */
  @Column('text', { array: true, nullable: true })
  attachedFiles: string[];

  /**
   * 모든 요청자에게 동일한 옵션 적용 여부
   */
  @Column({ default: false })
  applySameOptions: boolean;
}
