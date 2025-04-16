import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

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
