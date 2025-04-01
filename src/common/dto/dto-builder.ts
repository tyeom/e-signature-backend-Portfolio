import { User } from 'src/users/entities/user.entity';
import { BaseDto } from './base.dto';

export class DtoBuilder {
  /**
   * BaseDto를 상속받은 클래스의 인스턴스를 생성하고,
   * save 처리의 기본 속성들은 자동으로 할당해줍니다.
   *
   * @param dtoClass BaseDto를 상속받은 클래스 타입
   * @param properties 할당할 속성과 값들
   * @returns 생성된 DTO 인스턴스
   */
  static save<T extends BaseDto>(
    dtoClass: new () => T,
    properties: Partial<T>,
    user: User,
  ): T {
    const instance = new dtoClass();

    // 전달받은 속성들 할당
    Object.assign(instance, properties);

    // BaseDto 속성들 중 할당되지 않은 속성들 자동 할당
    if (instance.saveStatus === undefined) {
      instance.saveStatus = 'Save';
    }

    if (instance.approvalStatus === undefined) {
      instance.approvalStatus = 'A';
    }

    if (instance.isActive === undefined) {
      instance.isActive = true;
    }

    if (instance.isDeleted === undefined) {
      instance.isDeleted = false;
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.createdBy === undefined) {
      instance.createdBy = user;
    }

    return instance;
  }

  /**
   * BaseDto를 상속받은 클래스의 인스턴스를 생성하고,
   * update 처리의 기본 속성들은 자동으로 할당해줍니다.
   *
   * @param dtoClass BaseDto를 상속받은 클래스 타입
   * @param properties 할당할 속성과 값들
   * @returns 생성된 DTO 인스턴스
   */
  static update<T extends BaseDto>(
    dtoClass: new () => T,
    properties: Partial<T>,
    user: User,
  ): T {
    const instance = new dtoClass();

    // 전달받은 속성들 할당
    Object.assign(instance, properties);

    // BaseDto 속성들 중 할당되지 않은 속성들 자동 할당
    if (instance.saveStatus === undefined) {
      instance.saveStatus = 'Save';
    }

    if (instance.approvalStatus === undefined) {
      instance.approvalStatus = 'A';
    }

    if (instance.isActive === undefined) {
      instance.isActive = true;
    }

    if (instance.isDeleted === undefined) {
      instance.isDeleted = false;
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.modifiedBy === undefined) {
      instance.modifiedBy = user;
    }

    return instance;
  }

  /**
   * BaseDto를 상속받은 클래스의 인스턴스를 생성하고,
   * delete 처리의 기본 속성들은 자동으로 할당해줍니다.
   *
   * @param dtoClass BaseDto를 상속받은 클래스 타입
   * @param properties 할당할 속성과 값들
   * @returns 생성된 DTO 인스턴스
   */
  static delete<T extends BaseDto>(
    dtoClass: new () => T,
    properties: Partial<T>,
    user: User,
  ): T {
    const instance = new dtoClass();

    // 전달받은 속성들 할당
    Object.assign(instance, properties);

    // BaseDto 속성들 중 할당되지 않은 속성들 자동 할당
    if (instance.saveStatus === undefined) {
      instance.saveStatus = 'Save';
    }

    if (instance.approvalStatus === undefined) {
      instance.approvalStatus = 'A';
    }

    if (instance.isActive === undefined) {
      instance.isActive = false;
    }

    if (instance.isDeleted === undefined) {
      instance.isDeleted = true;
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.entryOrigin === undefined) {
      instance.entryOrigin = 'User';
    }

    if (instance.modifiedBy === undefined) {
      instance.modifiedBy = user;
    }

    return instance;
  }
}
