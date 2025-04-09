import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      select: [
        'id',
        'userGuid',
        'userName',
        'email',
        'lastLogin',
        'isSiteAdmin',
        'firstName',
        'lastName',
        'timezoneId',
        'isActive',
        'isDeleted',
      ],
      where: { email: email, isActive: true },
    });
  }

  async getUserByGuid(guid: string) {
    return await this.userRepository.findOne({
      where: { userGuid: guid, isActive: true },
    });
  }
}
