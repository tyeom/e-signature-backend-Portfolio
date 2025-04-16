import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { RequestESign } from '../../templates/entities/request-sign.entity';
import { BaseEntity } from '../../base/entities';

/**
 * 서명 문서
 */
@Entity({ schema: 'esign' })
export class SignDocument extends BaseEntity {
  /**
   * 템플릿 정보
   */
  @OneToOne(() => RequestESign, (requestESign) => requestESign.id, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  templates: RequestESign;

  /**
   * 문서 편집 상태
   *
   * editing : 문서 편집중
   *
   * complete : 문서 편집 완료
   */
  @Column({ default: 'editing', nullable: false })
  editingStatus: string;

  /**
   * 문서 상태
   *
   * requested : 문서 요청됨
   *
   * received : 문서 수신됨
   *
   * unknow : 문서 상태 알 수 없음
   */
  @Column({ default: 'unknow', nullable: false })
  documentStatus: string;

  /**
   * PDF 파일 사용자 암호화 설정
   */
  @Column({ nullable: true })
  pdfUserPassword: string;

  /**
   * PDF 파일 관리자 암호화 설정
   *
   * (파일 권한 설정된 정보 무시 ex: 수정 금지, 복사 금지)
   */
  @Column({ nullable: true })
  pdfOwnerPassword: string;

  /**
   * 기타 첨부 파일 이름
   *
   * 이미지, 파일 등
   */
  @Column('text', { array: true, nullable: true })
  attachedFiles: string[];

  /**
   * 편집 완료된 최종 PDF 파일
   */
  @Column({ nullable: true })
  editedFile: string;

  /**
   * 서명된 pdf 시그니처 해시 값
   */
  @Column({ nullable: true })
  signedDataDigest: string;

  /**
   * 객체 정보
   *
   * 서명 / 객체 위치, 사이즈 등
   */
  @Column('text', { nullable: true })
  documentBlob: string;

  /**
   * 기타 문서 정보 01
   */
  @Column('text', { nullable: true })
  documentInfo1: string;

  /**
   * 기타 문서 정보 02
   */
  @Column('text', { nullable: true })
  documentInfo2: string;
}
