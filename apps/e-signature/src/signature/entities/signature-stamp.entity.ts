import { BaseEntity } from '../../base/entities';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'esign' })
export class SignatureStamp extends BaseEntity {
  @Column()
  stampName: string;

  @Column()
  stampType: string;

  @Column('text', { array: true, nullable: true })
  stampImgs?: string[];

  @Column({ nullable: true })
  stampHeight?: string;

  /**
   * 이용 가능 맴버 (UserMaster)
   */
  @ManyToMany(() => User, {
    cascade: false,
    nullable: true,
  })
  @JoinTable()
  teammates: User[];
}
