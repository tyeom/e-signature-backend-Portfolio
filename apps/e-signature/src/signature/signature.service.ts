import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { User } from '../users/entities/user.entity';
import { In, QueryRunner, Repository } from 'typeorm';
import { Signature } from './entities/signature.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync } from 'fs';
import { UserDefaultSignature } from './entities/user-default-signature.entity';
import { UpdateUserDefaultSignatureDto } from './dto/update-user-default-signature.dto';
import { DtoBuilder } from '../base/dto';
import { UpdateSignatureDto } from './dto/update-signature.dto';
import { SignatureStamp } from './entities/signature-stamp.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { readFile, writeFile } from 'fs/promises';
import { removeBackground } from '@imgly/background-removal-node';

@Injectable()
export class SignatureService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Signature)
    private readonly signatureRepository: Repository<Signature>,
    @InjectRepository(SignatureStamp)
    private readonly signatureStampRepository: Repository<SignatureStamp>,
    @InjectRepository(UserDefaultSignature)
    private readonly userDefaultSignatureRepository: Repository<UserDefaultSignature>,
  ) {}

  /**
   * 이미지 배경 제거 처리
   * @param imageFileName 배경 제거할 이미지 파일명 배열
   */
  async rembgProc(imageFileName: string[]): Promise<void> {
    // const config = {
    //   publicPath: string; // The public path used for model and wasm files. Default: '`file://${path.resolve(`node_modules/${pkg.name}/dist/`)}/`.
    //   debug: bool; // enable or disable useful console.log outputs
    //   model: 'small' | 'medium'; // The model to use. (Default "medium")
    //   output: {
    //     format: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/x-rgba8'; // The output format. (Default "image/png")
    //     quality: number; // The quality. (Default: 0.8)
    //     type: 'foreground' | 'background' | 'mask'; // The output type. (Default "foreground")
    //   };
    // };

    const promises = imageFileName.map(async (imgFileName) => {
      const filePath = join(process.cwd(), 'public', 'signature', imgFileName);
      const imageBuffer = await readFile(filePath);
      const blob = new Blob([imageBuffer], { type: 'image/png' });
      const removedBackground = await removeBackground(blob);
      const buffer = Buffer.from(await removedBackground.arrayBuffer());
      await writeFile(filePath, Buffer.from(buffer));
    });

    try {
      const results = await Promise.all(promises);
      this.logger.log(
        `이미지 배경 제거 처리 완료 => ${results}`,
        SignatureService.name,
      );
    } catch (error) {
      this.logger.error(
        `이미지 배경 제거 처리 오류 => ${error}`,
        SignatureService.name,
      );
    }
  }

  async create(
    createSignatureDto: CreateSignatureDto,
    user: User,
    qr: QueryRunner,
  ) {
    if (
      createSignatureDto.signatureImgs &&
      createSignatureDto.signatureImgs.length > 0
    ) {
      const missingFile = createSignatureDto.signatureImgs.find(
        (img) => !existsSync(join(process.cwd(), 'public', 'signature', img)),
      );

      if (missingFile) {
        throw new BadRequestException(
          `선업로드되지 않은 파일 입니다. - ${missingFile}`,
        );
      }
    }

    const saveCreateSignatureDto = DtoBuilder.save(
      CreateSignatureDto,
      createSignatureDto,
      user,
    );

    let teammates: User[] = [];
    if (saveCreateSignatureDto.teammates) {
      teammates = await qr.manager.find(User, {
        where: {
          id: In(saveCreateSignatureDto.teammates),
          isActive: true,
        },
      });
    }

    if (!teammates || teammates.length <= 0) {
      throw new BadRequestException('teammates - 잘못된 사용자 id 입니다.');
    }

    const saveSignature = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(Signature)
      .values({ ...saveCreateSignatureDto, teammates: teammates })
      .execute();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signatureId = saveSignature.identifiers[0].id;
    if (teammates) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.createSignatureTeammatesRelation(qr, signatureId, teammates);
    }

    return saveSignature;
  }

  private async createSignatureTeammatesRelation(
    qr: QueryRunner,
    signatureId: number,
    teammates: User[],
  ) {
    return await qr.manager
      .createQueryBuilder()
      .relation(Signature, 'teammates')
      .of(signatureId)
      .add(teammates.map((user) => user.id));
  }

  async findAll(user: User) {
    const signature = await this.signatureRepository.findAndCount({
      where: { isDeleted: false, createdBy: { id: user.id } },
      relations: ['teammates', 'createdBy'],
    });

    return signature;
  }

  async findAllBySignature_Stamp(user: User) {
    const signature = await this.findAll(user);
    const stamp = await this.signatureStampRepository.findAndCount({
      where: { isDeleted: false, createdBy: { id: user.id } },
      relations: ['teammates', 'createdBy'],
    });

    return { signature, stamp };
  }

  async updateSignature(
    id: number,
    updateSignatureDto: UpdateSignatureDto,
    user: User,
    qr: QueryRunner,
  ) {
    const signature = await this.signatureRepository.findOne({
      where: { id: id, isDeleted: false, createdBy: { id: user.id } },
    });

    if (!signature) {
      throw new BadRequestException(`없는 signature 입니다.`);
    }

    const updateDefaultSignatureDto = DtoBuilder.update(
      CreateSignatureDto,
      updateSignatureDto,
      user,
    );

    Object.assign(signature, updateDefaultSignatureDto);

    return await this.signatureRepository.save(signature);
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
    signature.modifiedBy = user;

    return this.signatureRepository.save(signature);

    // const updateSignature = await qr.manager
    //   .createQueryBuilder()
    //   .update(Signature)
    //   .set(signature)
    //   .where('id = :id', { id: id })
    //   .execute();

    // return updateSignature;
  }

  async updateDefaultSignature(
    id: number,
    type: string,
    user: User,
    qr: QueryRunner,
  ) {
    if (type === 'signature') {
      const signature = await this.signatureRepository.findOne({
        where: { id: id, isDeleted: false, createdBy: { id: user.id } },
      });

      if (!signature) {
        throw new BadRequestException(`없는 signature 입니다.`);
      }

      const defaultSignature =
        await this.userDefaultSignatureRepository.findOne({
          where: { createdBy: { id: user.id } },
        });

      if (!defaultSignature) {
        const userDefaultSignatureDto = new UpdateUserDefaultSignatureDto();
        userDefaultSignatureDto.type = type;
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
        defaultSignature.type = type;
        defaultSignature.signature = signature;

        return await this.userDefaultSignatureRepository.save(defaultSignature);
      }
    } else if (type === 'stamp') {
      const stamp = await this.signatureStampRepository.findOne({
        where: { id: id, isDeleted: false, createdBy: { id: user.id } },
      });

      if (!stamp) {
        throw new BadRequestException(`없는 stamp 입니다.`);
      }

      const defaultSignature =
        await this.userDefaultSignatureRepository.findOne({
          where: { createdBy: { id: user.id } },
        });

      if (!defaultSignature) {
        const userDefaultSignatureDto = new UpdateUserDefaultSignatureDto();
        userDefaultSignatureDto.type = type;
        userDefaultSignatureDto.stamp = stamp;
        const createDefaultSignatureDto = DtoBuilder.save(
          UpdateUserDefaultSignatureDto,
          userDefaultSignatureDto,
          user,
        );

        return await this.userDefaultSignatureRepository.save(
          createDefaultSignatureDto,
        );
      } else {
        defaultSignature.type = type;
        defaultSignature.stamp = stamp;

        return await this.userDefaultSignatureRepository.save(defaultSignature);
      }
    } else {
      throw new BadRequestException('잘못된 타입 입니다.');
    }
  }

  async getDefaultSignature(user: User) {
    const defaultSignature = await this.userDefaultSignatureRepository.findOne({
      where: { createdBy: { id: user.id } },
      relations: ['createdBy', 'signature', 'stamp'],
    });

    if (!defaultSignature) {
      throw new BadRequestException(`설정된 기본 signature가 없습니다.`);
    }

    return defaultSignature;
  }
}
