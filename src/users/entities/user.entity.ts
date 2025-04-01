import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'UserMaster', schema: 'web' })
export class User {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'UserGuid' })
  userGuid: string;

  @Column({ name: 'MobileNumber', nullable: true })
  mobileNumber: string;

  @Column({ name: 'ContactPerson' })
  contactPerson: string;

  @Column({ name: 'UserName' })
  userName: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'LastLogin' })
  lastLogin: Date;

  @Column({ name: 'IsSiteAdmin' })
  isSiteAdmin: boolean;

  @Column({ name: 'FirstName' })
  firstName: string;

  @Column({ name: 'LastName' })
  lastName: string;

  @Column({ name: 'TimezoneId' })
  timezoneId: number;

  @Column({ name: 'IsActive' })
  isActive: boolean;

  @Column({ name: 'IsDeleted', nullable: true })
  isDeleted: boolean;

  @Column({ name: 'EntryOrigin' })
  entryOrigin: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'CreatedAt' })
  createdAt: Date;

  @Column({ name: 'CreatedBy' })
  createdBy: number;

  @UpdateDateColumn({ type: 'timestamptz', name: 'ModifiedAt' })
  modifiedAt: Date;

  @Column({ name: 'ModifiedBy' })
  modifiedBy: number;
}
