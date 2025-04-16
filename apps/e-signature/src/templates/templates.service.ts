import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTemplatesDto } from './dto/create-templates-dto';
import { User } from '../users/entities/user.entity';
import { rename } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'node:fs';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '../common/common.service';
import { RequestESign } from './entities/request-sign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryRunner, Repository } from 'typeorm';
import { Requestee } from './entities/requestee.entity';
import { CreateRequesteeDto } from './dto/create-requestee-dto';
import { DtoBuilder } from '../base/dto';
import { GetRequesteeDto } from './dto/get-requestee-dto';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    @InjectRepository(RequestESign)
    private readonly requestESignRepository: Repository<RequestESign>,
    @InjectRepository(Requestee)
    private readonly requesteeRepository: Repository<Requestee>,
  ) {}

  private renameFile(
    tempFolder: string,
    attachedFilesFolder: string,
    createTemplatesDto: CreateTemplatesDto,
  ) {
    if (!createTemplatesDto.requestee) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, value1] of createTemplatesDto.requestee.entries()) {
      if (!value1.attachedFiles) continue;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [__, value2] of value1.attachedFiles.entries()) {
        if (value2) {
          if (this.configService.get<boolean>('USE_S3_STORAGE') === false) {
            // temp 폴더 파일 체크
            if (existsSync(join(process.cwd(), tempFolder, value2)) === false) {
              throw new BadRequestException(
                `선업로드되지 않은 파일 입니다. - ${value2}`,
              );
            }
            rename(
              join(process.cwd(), tempFolder, value2),
              join(process.cwd(), attachedFilesFolder, value2),
            );
          } else {
            this.commonService.saveMovieToPermanentStorage(value2);
          }
        }
      }
    }
  }

  private async createRequestee(
    qr: QueryRunner,
    createRequesteeDto: CreateRequesteeDto,
    requestESignId: number,
  ) {
    return qr.manager
      .createQueryBuilder()
      .insert()
      .into(Requestee)
      .values({
        ...createRequesteeDto,
        requestESign: { id: requestESignId },
      })
      .execute();
  }

  private async createRequestESign(
    qr: QueryRunner,
    createTemplatesDto: CreateTemplatesDto,
    teammates: User[],
    user: User,
  ) {
    return qr.manager
      .createQueryBuilder()
      .insert()
      .into(RequestESign)
      .values({
        ...createTemplatesDto,
        requestESignCreator: user,
        teammates: teammates,
      })
      .execute();
  }

  private createRequestESignTeammatesRelation(
    qr: QueryRunner,
    requestESignId: number,
    teammates: User[],
  ) {
    return qr.manager
      .createQueryBuilder()
      .relation(RequestESign, 'teammates')
      .of(requestESignId)
      .add(teammates.map((user) => user.id));
  }

  async findAll(getRequesteeDto: GetRequesteeDto, user: User) {
    const {
      projectName,
      requestESignCreator,
      status,
      startDate,
      endDate,
      page,
      take,
    } = getRequesteeDto;

    const queryBuilder = this.requestESignRepository
      .createQueryBuilder('esign')
      .leftJoinAndSelect('esign.requestESignCreator', 'requestESignCreator')
      .leftJoinAndSelect('esign.teammates', 'teammates')
      .leftJoinAndSelect('esign.requestees', 'requestees');

    if (projectName) {
      queryBuilder.where('esign.projectName LIKE :projectName', {
        projectName: `%${projectName}%`,
      });
    }

    if (requestESignCreator) {
      queryBuilder.where('requestESignCreator.UserName = :userName', {
        userName: requestESignCreator,
      });
    }

    if (status) {
      queryBuilder.where('esign.status = :status', {
        status,
      });
    }

    if (startDate && endDate) {
      queryBuilder.where('esign.createdAt BETWEEN :startDate AND :endDate', {
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
      });
    }

    queryBuilder.andWhere('esign.isDeleted = :isDeleted', {
      isDeleted: false,
    });
    queryBuilder.andWhere('esign.isActive = :isActive', {
      isActive: true,
    });

    // 로그인 인증된 유저의 데이터만 조회
    queryBuilder.andWhere('esign.CreatedBy = :createdBy', {
      createdBy: user.id,
    });

    if (take && page) {
      const skip = (page - 1) * take;
      queryBuilder.take(take);
      queryBuilder.skip(skip);
    }

    return await queryBuilder.getManyAndCount();
  }

  async findOneById(id: number, user: User) {
    const queryBuilder = this.requestESignRepository
      .createQueryBuilder('esign')
      .leftJoinAndSelect('esign.requestESignCreator', 'requestESignCreator')
      .leftJoinAndSelect('esign.teammates', 'teammates')
      .leftJoinAndSelect('esign.requestees', 'requestees');

    queryBuilder.where('esign.id = :id', {
      id,
    });

    queryBuilder.andWhere('esign.isDeleted = :isDeleted', {
      isDeleted: false,
    });
    queryBuilder.andWhere('esign.isActive = :isActive', {
      isActive: true,
    });

    // 로그인 인증된 유저의 데이터만 조회
    queryBuilder.andWhere('esign.CreatedBy = :createdBy', {
      createdBy: user.id,
    });

    return await queryBuilder.getOne();
  }

  /**
   * RequestESign 상세 데이터 조회 [Requestee]
   * @param id RequestESign 데이터 id
   * @param user 인증된 사용자
   * @returns Requestee 데이터
   */
  async findTemplatesDetail(id: number, user: User) {
    const template = await this.findOneById(id, user);
    if (!template) {
      throw new BadRequestException('존재하지 않은 template id 입니다.');
    }

    const queryBuilder =
      this.requesteeRepository.createQueryBuilder('requestee');

    queryBuilder.where('requestee.requestESign = :id', {
      id,
    });

    // 로그인 인증된 유저의 데이터만 조회
    queryBuilder.andWhere('requestee.CreatedBy = :createdBy', {
      createdBy: user.id,
    });

    return await queryBuilder.getMany();
  }

  async createTemplates(
    createTemplatesDto: CreateTemplatesDto,
    user: User,
    qr: QueryRunner,
  ) {
    // 선 업로드된 파일 처리
    const tempFolder = join('public', 'temp');
    const attachedFilesFolder = join('public', 'attachedFiles');
    this.renameFile(tempFolder, attachedFilesFolder, createTemplatesDto);

    const saveCreateTemplatesDto = DtoBuilder.save(
      CreateTemplatesDto,
      createTemplatesDto,
      user,
    );

    let teammates: User[] = [];
    if (saveCreateTemplatesDto.teammates) {
      teammates = await qr.manager.find(User, {
        where: {
          id: In(saveCreateTemplatesDto.teammates),
          isActive: true,
        },
      });
    }

    const requestESign = await this.createRequestESign(
      qr,
      saveCreateTemplatesDto,
      teammates,
      user,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const requestESignId = requestESign.identifiers[0].id;

    if (teammates) {
      this.createRequestESignTeammatesRelation(qr, requestESignId, teammates);
    }

    if (saveCreateTemplatesDto.requestee) {
      for (const [_, value] of saveCreateTemplatesDto.requestee.entries()) {
        const saveRequesteeDto = DtoBuilder.save(
          CreateRequesteeDto,
          value,
          user,
        );
        const requestee = await this.createRequestee(
          qr,
          saveRequesteeDto,
          requestESignId,
        );
      }
    }

    return await qr.manager.findOne(RequestESign, {
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        id: requestESignId,
      },
      relations: ['teammates', 'requestees'],
    });
  }

  async updateTemplate(
    requestESignId: number,
    templatesDto: CreateTemplatesDto,
    user: User,
    qr: QueryRunner,
  ) {
    // 01. 변경 대상 RequestESign 데이터 찾기
    const oldRequestESign = await this.findOneById(requestESignId, user);
    if (!oldRequestESign) {
      throw new BadRequestException('존재하지 않은 Template id 입니다.');
    }

    // 02. 선 업로드된 파일 처리
    const tempFolder = join('public', 'temp');
    const attachedFilesFolder = join('public', 'attachedFiles');
    this.renameFile(tempFolder, attachedFilesFolder, templatesDto);

    // 03. 업데이트 상태로 dto 변경
    const updateTemplatesDto = DtoBuilder.update(
      CreateTemplatesDto,
      templatesDto,
      user,
    );

    // 04. RequestESign 객체 업데이트 정보로 반영
    Object.assign(oldRequestESign, updateTemplatesDto);

    // 05. 유효한 teammates 인지 체크
    let teammates: User[] = [];
    if (updateTemplatesDto.teammates) {
      teammates = await qr.manager.find(User, {
        where: {
          id: In(updateTemplatesDto.teammates),
          isActive: true,
        },
      });
    }

    if (
      updateTemplatesDto.teammates &&
      updateTemplatesDto.teammates.length !== teammates.length
    ) {
      throw new BadRequestException('존재하지 않은 teammates 정보 입니다.');
    }

    if (teammates) {
      oldRequestESign.teammates = teammates;
    }
    // 06. RequestESign 업데이트 반영
    await this.requestESignRepository.save(oldRequestESign);

    // 07. Requestee 새로 추가
    if (updateTemplatesDto.requestee) {
      for (const [_, value] of updateTemplatesDto.requestee.entries()) {
        const saveRequesteeDto = DtoBuilder.save(
          CreateRequesteeDto,
          value,
          user,
        );
        const requestee = await this.createRequestee(
          qr,
          saveRequesteeDto,
          requestESignId,
        );
      }
    }

    // 08. 기존 requestee 데이터는 삭제
    if (oldRequestESign.requestees) {
      qr.manager.delete(Requestee, {
        id: In([...oldRequestESign.requestees.map((item) => item.id)]),
      });
    }

    return await qr.manager.findOne(RequestESign, {
      where: {
        id: requestESignId,
      },
      relations: ['teammates', 'requestees'],
    });
  }

  async deleteTemplates(id: number, user: User, qr: QueryRunner) {
    const template = await qr.manager.findOne(RequestESign, {
      where: {
        id,
        isDeleted: false,
        createdBy: { id: user.id },
      },
    });

    if (!template) {
      throw new BadRequestException('존재하지 않은 Template id 입니다.');
    }

    template.isDeleted = true;
    template.isActive = false;
    template.modifiedBy = user;

    return this.requestESignRepository.save(template);

    // return qr.manager
    //   .createQueryBuilder()
    //   .update(RequestESign)
    //   .set({
    //     ...template,
    //     updatedAt: () => 'NOW()',
    //   })
    //   .where('id = :id', { id })
    //   .execute();
  }
}
