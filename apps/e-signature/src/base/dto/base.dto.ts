import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @Exclude()
  @ApiHideProperty()
  saveStatus: string;
  @Exclude()
  @ApiHideProperty()
  approvalStatus: string;
  @Exclude()
  @ApiHideProperty()
  isActive: boolean;
  @Exclude()
  @ApiHideProperty()
  isDeleted: boolean;
  @Exclude()
  @ApiHideProperty()
  entryOrigin: string;
  @Exclude()
  @ApiHideProperty()
  createdBy: User;
  @Exclude()
  @ApiHideProperty()
  modifiedBy: User;
}
