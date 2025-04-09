import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class Model {
  @Type(() => UserDto)
  @Expose({ name: 'UserData' })
  user: UserDto;
  @Expose({ name: 'Token' })
  token: string;
}

export class TokenResponseDto {
  @Type(() => Model)
  @Expose({ name: 'Model' })
  model: Model;
}
