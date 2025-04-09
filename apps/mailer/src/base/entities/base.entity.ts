import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { User } from '../../entities/user.entity';

export class BaseEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'SaveStatus' })
  saveStatus: string;

  @Column({ name: 'ApprovalStatus' })
  approvalStatus: string;

  @Column({ name: 'IsActive' })
  isActive: boolean;

  @Column({ name: 'IsDeleted', nullable: true })
  isDeleted: boolean;

  @Column({ name: 'EntryOrigin' })
  entryOrigin: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedAt' })
  createdAt: Date;

  /**
   * 생성자
   */
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'CreatedBy' })
  createdBy: User;

  @UpdateDateColumn({ type: 'timestamptz', name: 'ModifiedAt' })
  modifiedAt: Date;

  /**
   * 수정자
   */
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'ModifiedBy' })
  modifiedBy: User;

  @VersionColumn()
  version: number;
}
