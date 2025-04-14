import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Signature } from './signature.entity';
import { BaseEntity } from '../../base/entities';
import { SignatureStamp } from './signature-stamp.entity';

@Entity({ schema: 'esign' })
export class UserDefaultSignature extends BaseEntity {
  @OneToOne(() => Signature)
  @JoinColumn()
  signature: Signature;

  @OneToOne(() => SignatureStamp)
  @JoinColumn()
  stamp: SignatureStamp;

  @Column()
  type: string;
}
