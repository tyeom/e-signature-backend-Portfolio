import { Expose } from 'class-transformer';

export class UserDto {
  @Expose({ name: 'UserId' })
  userId: string;
  @Expose({ name: 'UserName' })
  userName: string;
  @Expose({ name: 'Email' })
  email: string;
}
