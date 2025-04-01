import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ schema: 'esign' })
export class Signature extends BaseEntity {
  @Column()
  fullName: string;

  @Column()
  initials: string;

  @Column({ nullable: true })
  signatureImg?: string;
}
