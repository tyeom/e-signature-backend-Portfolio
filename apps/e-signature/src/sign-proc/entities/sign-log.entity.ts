import { BaseEntity } from '../../base/entities';
import { Column, Entity } from 'typeorm';

@Entity({ schema: 'esign' })
export class SignLog extends BaseEntity {
  /**
   * 서명된 pdf 파일명
   */
  @Column()
  signedPdfFileName: string;

  /**
   * 서명된 pdf 시그니처 해시 값
   */
  @Column()
  signedDataDigest: string;
}
