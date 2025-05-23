import { BaseEntity } from '../../base/entities';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ schema: 'esign' })
export class Signature extends BaseEntity {
  @Column()
  fullName: string;

  @Column()
  initials: string;

  @Column('text', { array: true, nullable: true })
  signatureImgs?: string[];

  @Column('text', { array: true, nullable: true })
  initialsImgs?: string[];

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
