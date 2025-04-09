import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { User } from '../users/entities/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { Signature } from './entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync } from 'fs';
import { UserDefaultSignature } from './entities/user-default-signature.entity';
import { UpdateUserDefaultSignatureDto } from './dto/update-user-default-signature.dto';
import { DtoBuilder } from '../base/dto';

@Injectable()
export class SignatureService {
  constructor(
    @InjectRepository(Signature)
    private readonly signatureRepository: Repository<Signature>,
    @InjectRepository(UserDefaultSignature)
    private readonly userDefaultSignatureRepository: Repository<UserDefaultSignature>,
  ) {}

  async create(
    createSignatureDto: CreateSignatureDto,
    user: User,
    qr: QueryRunner,
  ) {
    if (createSignatureDto.signatureImg) {
      if (
        existsSync(
          join(
            process.cwd(),
            'public',
            'signature',
            createSignatureDto.signatureImg,
          ),
        ) === false
      ) {
        throw new BadRequestException(
          `선업로드되지 않은 파일 입니다. - ${createSignatureDto.signatureImg}`,
        );
      }
    }

    const saveCreateSignatureDto = DtoBuilder.save(
      CreateSignatureDto,
      createSignatureDto,
      user,
    );

    const saveSignature = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(Signature)
      .values(saveCreateSignatureDto)
      .execute();

    return saveSignature;
  }

  async findAll(user: User) {
    const signature = await this.signatureRepository.findAndCount({
      where: { isDeleted: false, createdBy: { id: user.id } },
      relations: ['createdBy'],
    });

    return signature;
  }

  async removeSignature(id: number, user: User, qr: QueryRunner) {
    const signature = await this.signatureRepository.findOne({
      where: { id: id, isDeleted: false, createdBy: { id: user.id } },
    });

    if (!signature) {
      throw new BadRequestException(`없는 signature 입니다.`);
    }

    signature.isActive = false;
    signature.isDeleted = true;

    return this.signatureRepository.save(signature);

    // const updateSignature = await qr.manager
    //   .createQueryBuilder()
    //   .update(Signature)
    //   .set(signature)
    //   .where('id = :id', { id: id })
    //   .execute();

    // return updateSignature;
  }

  async updateDefaultSignature(id: number, user: User, qr: QueryRunner) {
    const signature = await this.signatureRepository.findOne({
      where: { id: id, isDeleted: false, createdBy: { id: user.id } },
    });

    if (!signature) {
      throw new BadRequestException(`없는 signature 입니다.`);
    }

    const defaultSignature = await this.userDefaultSignatureRepository.findOne({
      where: { createdBy: { id: user.id } },
    });

    if (!defaultSignature) {
      const userDefaultSignatureDto = new UpdateUserDefaultSignatureDto();
      userDefaultSignatureDto.signature = signature;
      const createDefaultSignatureDto = DtoBuilder.save(
        UpdateUserDefaultSignatureDto,
        userDefaultSignatureDto,
        user,
      );

      return await this.userDefaultSignatureRepository.save(
        createDefaultSignatureDto,
      );
    } else {
      defaultSignature.signature = signature;

      return await this.userDefaultSignatureRepository.save(defaultSignature);
    }
  }

  async getDefaultSignature(user: User) {
    const defaultSignature = await this.userDefaultSignatureRepository.findOne({
      where: { createdBy: { id: user.id } },
      relations: ['createdBy', 'signature'],
    });

    if (!defaultSignature) {
      throw new BadRequestException(`설정된 기본 signature가 없습니다.`);
    }

    return defaultSignature;
  }
}
