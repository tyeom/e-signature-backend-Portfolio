import { BaseEntity } from 'src/common/entities/base.entity';
import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { Signature } from './signature.entity';

@Entity({ schema: 'esign' })
export class UserDefaultSignature extends BaseEntity {
  @OneToOne(() => Signature)
  @JoinColumn()
  signature: Signature;
}
