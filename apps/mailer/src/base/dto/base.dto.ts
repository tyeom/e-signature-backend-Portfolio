import { Exclude } from 'class-transformer';
import { User } from '../../entities/user.entity';

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
