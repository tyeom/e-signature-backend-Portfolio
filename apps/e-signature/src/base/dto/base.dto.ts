import { User } from '../../users/entities/user.entity';
import { ApiHideProperty } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiHideProperty()
  saveStatus: string;
  @ApiHideProperty()
  approvalStatus: string;
  @ApiHideProperty()
  isActive: boolean;
  @ApiHideProperty()
  isDeleted: boolean;
  @ApiHideProperty()
  entryOrigin: string;
  @ApiHideProperty()
  createdBy: User;
  @ApiHideProperty()
  modifiedBy: User;
}
