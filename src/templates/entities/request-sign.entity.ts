import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Requestee } from './requestee.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

/**
 * 서명 요청
 */
@Entity({ schema: 'esign' })
export class RequestESign extends BaseEntity {
  /**
   * 프로젝트 이름
   */
  @Column()
  projectName: string;

  /**
   * 문서 이름
   */
  @Column()
  documentName: string;

  /**
   * 참여자 (UserMaster)
   */
  @ManyToMany(() => User, {
    cascade: false,
    nullable: true,
  })
  @JoinTable()
  teammates: User[];

  /**
   * 생성자
   */
  @ManyToOne(() => User, (user) => user.id)
  requestESignCreator: User;

  /**
   * 생성일
   */
  @CreateDateColumn()
  requestESignCreatedDate: Date;

  /**
   * 만료일
   */
  @Column({ type: 'timestamp', nullable: true })
  requestESignExpireDate: Date;

  /**
   * 나에게 서명 요청 여부
   */
  @Column({ default: false })
  requestSignatureForMe: boolean;

  /**
   * 예약 전송 여부
   */
  @Column({ default: false })
  scheduledSend: boolean;

  /**
   * 예약 전송 날짜
   */
  @Column({ type: 'timestamp', nullable: true })
  scheduledSendDate: Date;

  /**
   * 서명자가 문서를 편집 가능 여부
   */
  @Column({ default: false })
  allowDocumentEditing: boolean;

  /**
   * 서명 순서 강제 여부
   */
  @Column({ default: false })
  mustSignInOrder: boolean;

  /**
   * 내부 서명 여부
   */
  @Column({ default: false })
  internalSignature: boolean;

  /**
   * 요청자 리스트
   */
  @OneToMany(() => Requestee, (requestee) => requestee.requestESign, {
    cascade: true,
  })
  requestees: Requestee[];

  /**
   * 서명 요청 전송 날짜
   */
  @Column({ type: 'timestamp', nullable: true })
  sentDate: Date;

  /**
   * 서명 상태
   */
  @Column({ nullable: true })
  status: string;

  /**
   * 파일 이름
   */
  @Column('text', { array: true, nullable: true })
  fileName: string[];
}
