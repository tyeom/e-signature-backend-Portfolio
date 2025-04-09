import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base/entities';
import { MailTemplates } from './mail-templates.entity';

/**
 * 대량 메일 템플릿
 */
@Entity({ schema: 'esign' })
export class MailTemplatesDetail extends BaseEntity {
  /**
   * 메일 템플릿 ID (외래키)
   */
  @ManyToOne(
    () => MailTemplates,
    (mailTemplates) => mailTemplates.templatesDetail,
    {
      onDelete: 'CASCADE',
    },
  )
  mailTemplates: MailTemplates;

  /**
   * 번호
   */
  @Column()
  order: number;

  /**
   * 문서명
   */
  @Column()
  documentName: string;

  /**
   * 서명자 이름
   */
  @Column()
  signatoryName: string;

  /**
   * 이메일 또는 전화번호
   */
  @Column()
  emailOrPhone: string;

  /**
   * 사용자 언어
   */
  @Column()
  userLang: 'en' | 'ko';

  /**
   * 남길 말
   */
  @Column({ nullable: true })
  comment?: string;

  /**
   * 접근 암호
   */
  @Column({ nullable: true })
  password?: string;

  /**
   * 암호 힌트
   */
  @Column({ nullable: true })
  passwordHint?: string;
}
