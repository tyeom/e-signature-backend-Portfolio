import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync } from 'fs';
import { DtoBuilder } from '../base/dto';
import { SignatureStamp } from './entities/signature-stamp.entity';
import { CreateSignatureStampDto } from './dto/create-signature-stamp.dto';
import { UpdateSignatureStampDto } from './dto/update-signature-stamp.dto';

@Injectable()
export class SignatureStampService {
  constructor(
    @InjectRepository(SignatureStamp)
    private readonly signatureStampRepository: Repository<SignatureStamp>,
  ) {}

  async create(
    createSignatureStampDto: CreateSignatureStampDto,
    user: User,
    qr: QueryRunner,
  ) {
    if (
      createSignatureStampDto.stampImgs &&
      createSignatureStampDto.stampImgs.length > 0
    ) {
      const missingFile = createSignatureStampDto.stampImgs.find(
        (img) => !existsSync(join(process.cwd(), 'public', 'signature', img)),
      );

      if (missingFile) {
        throw new BadRequestException(
          `선업로드되지 않은 파일 입니다. - ${missingFile}`,
        );
      }
    }

    const saveCreateSignatureStampDto = DtoBuilder.save(
      CreateSignatureStampDto,
      createSignatureStampDto,
      user,
    );

    let teammates: User[] = [];
    if (saveCreateSignatureStampDto.teammates) {
      teammates = await qr.manager.find(User, {
        where: {
          id: In(saveCreateSignatureStampDto.teammates),
          isActive: true,
        },
      });
    }

    if (!teammates || teammates.length <= 0) {
      throw new BadRequestException('teammates - 잘못된 사용자 id 입니다.');
    }

    const saveStamp = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(SignatureStamp)
      .values({ ...saveCreateSignatureStampDto, teammates: teammates })
      .execute();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const stampId = saveStamp.identifiers[0].id;

    if (teammates) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.createStampTeammatesRelation(qr, stampId, teammates);
    }

    return saveStamp;
  }

  private async createStampTeammatesRelation(
    qr: QueryRunner,
    stampId: number,
    teammates: User[],
  ) {
    return await qr.manager
      .createQueryBuilder()
      .relation(SignatureStamp, 'teammates')
      .of(stampId)
      .add(teammates.map((user) => user.id));
  }

  async findAll(user: User) {
    const stamp = await this.signatureStampRepository.findAndCount({
      where: { isDeleted: false, createdBy: { id: user.id } },
      relations: ['teammates', 'createdBy'],
    });

    return stamp;
  }

  async updateSignatureStamp(
    id: number,
    updateSignatureStampDto: UpdateSignatureStampDto,
    user: User,
    qr: QueryRunner,
  ) {
    const stamp = await this.signatureStampRepository.findOne({
      where: { id: id, isDeleted: false, createdBy: { id: user.id } },
    });

    if (!stamp) {
      throw new BadRequestException(`없는 stamp 입니다.`);
    }

    const updateStampDto = DtoBuilder.update(
      CreateSignatureStampDto,
      updateSignatureStampDto,
      user,
    );

    Object.assign(stamp, updateStampDto);

    return await this.signatureStampRepository.save(stamp);
  }

  async removeSignatureStamp(id: number, user: User, qr: QueryRunner) {
    const stamp = await this.signatureStampRepository.findOne({
      where: { id: id, isDeleted: false, createdBy: { id: user.id } },
    });

    if (!stamp) {
      throw new BadRequestException(`없는 stamp 입니다.`);
    }

    stamp.isActive = false;
    stamp.isDeleted = true;
    stamp.modifiedBy = user;

    return this.signatureStampRepository.save(stamp);
  }
}
