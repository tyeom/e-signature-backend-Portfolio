import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { Signature } from './signature.entity';
import { BaseEntity } from '../../base/entities';

@Entity({ schema: 'esign' })
export class UserDefaultSignature extends BaseEntity {
  @OneToOne(() => Signature)
  @JoinColumn()
  signature: Signature;
}
