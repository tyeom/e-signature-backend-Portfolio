import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

export abstract class BaseDto {
  @Exclude()
  saveStatus: string;
  @Exclude()
  approvalStatus: string;
  @Exclude()
  isActive: boolean;
  @Exclude()
  isDeleted: boolean;
  @Exclude()
  entryOrigin: string;
  @Exclude()
  createdBy: User;
  @Exclude()
  modifiedBy: User;
}
