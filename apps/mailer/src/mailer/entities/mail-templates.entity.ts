import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base/entities';
import { MailTemplatesDetail } from './mail-templates-detail.entity';

/**
 * 대량 메일 템플릿
 */
@Entity({ schema: 'esign' })
export class MailTemplates extends BaseEntity {
  /**
   * 라벨
   */
  @Column()
  label: string;

  /**
   * 템플릿 정보
   */
  @OneToMany(() => MailTemplatesDetail, (detail) => detail.mailTemplates, {
    cascade: true,
  })
  templatesDetail: MailTemplatesDetail[];
}
