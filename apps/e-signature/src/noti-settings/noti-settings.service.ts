import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { User } from '../users/entities/user.entity';
import { NotificationSetting } from './entities/notification-setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DtoBuilder } from '../base/dto';
import { CreateSettingDto } from './dto/create-setting.dto';

@Injectable()
export class NotiSettingsService {
  constructor(
    @InjectRepository(NotificationSetting)
    private readonly notiSettingRepository: Repository<NotificationSetting>,
  ) {}

  async updateNotiSetting(updateSettingDto: UpdateSettingDto, user: User) {
    const queryBuilder = this.notiSettingRepository.createQueryBuilder(
      'notification_setting',
    );

    queryBuilder.where('notification_setting.createdBy = :createdBy', {
      createdBy: user.id,
    });
    queryBuilder.andWhere('notification_setting.isActive = true');

    const notiSetting = await queryBuilder.getOne();

    if (!notiSetting) {
      throw new InternalServerErrorException(
        '알림 설정 관련 데이터가 존재 하지 않습니다.',
      );
    }

    const updateNotiSettingDto = DtoBuilder.update(
      CreateSettingDto,
      updateSettingDto,
      user,
    );

    await this.notiSettingRepository.update(
      {
        id: notiSetting.id,
      },
      {
        ...updateNotiSettingDto,
      },
    );

    const updatedNotiSetting = await this.notiSettingRepository.findOne({
      where: {
        createdBy: { id: user.id },
        isActive: true,
      },
    });

    return updatedNotiSetting;
  }

  async findByUserId(user: User) {
    const queryBuilder = this.notiSettingRepository.createQueryBuilder(
      'notification_setting',
    );

    queryBuilder.where('notification_setting.createdBy = :createdBy', {
      createdBy: user.id,
    });
    queryBuilder.andWhere('notification_setting.isActive = true');

    const notiSetting = await queryBuilder.getOne();

    // NotiSettings 데이터가 없다면 최초 설정 유저로 새로 데이터 생성 후 반환해준다.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!notiSetting) {
      const createSettingDto = new CreateSettingDto();
      const saveNotiSettingDto = DtoBuilder.save(
        CreateSettingDto,
        createSettingDto,
        user,
      );
      return await this.notiSettingRepository.save({
        ...saveNotiSettingDto,
      });
    }

    const newNotiSetting = await this.notiSettingRepository.findOne({
      where: {
        createdBy: { id: user.id },
        isActive: true,
      },
    });

    return newNotiSetting;
  }
}
