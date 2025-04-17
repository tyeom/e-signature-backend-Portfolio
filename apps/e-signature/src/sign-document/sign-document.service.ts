import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { CreateSignDocumentDto } from './dto/create-sign-document.dto';
import { UpdateSignDocumentDto } from './dto/update-sign-document.dto';
import { SignProcService } from '../sign-proc/sign-proc.service';
import { User } from '../users/entities/user.entity';
import { rename, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'node:fs';
import { ClientProxy } from '@nestjs/microservices/client';
import { RpcException } from '@nestjs/microservices/exceptions';
import { MAILER_SERVICE } from '@app/common/const';
import { MailTemplatesDto } from './dto/mail-templates.dto';
import { lastValueFrom } from 'rxjs';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DtoBuilder } from '../base/dto';
import { SignDocument } from './entities/sign-document.entity';
import { TemplatesService } from '../templates/templates.service';
import { InjectRepository } from '@nestjs/typeorm';

type FilePath = 'attachedFiles' | 'document';

@Injectable()
export class SignDocumentService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
    private readonly signProcService: SignProcService,
    @Inject(forwardRef(() => TemplatesService))
    private readonly templatesService: TemplatesService,
    @InjectRepository(SignDocument)
    private readonly signDocumentRepository: Repository<SignDocument>,
    @Inject(MAILER_SERVICE)
    private readonly maillerMicroservice: ClientProxy,
  ) {}

  async testPDFSign(createSignDocumentDto: CreateSignDocumentDto, user: User) {
    return await this.signProcService.signByPDF(
      createSignDocumentDto.editedFile!,
      user,
      createSignDocumentDto.pdfUserPassword,
      createSignDocumentDto.pdfOwnerPassword,
    );
  }

  async testSendBulkMail(testSendBulkMail: MailTemplatesDto, user: User) {
    testSendBulkMail.user = user;

    // eslint-disable-next-line no-useless-catch
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await lastValueFrom(
        this.maillerMicroservice.send(
          { cmd: 'sendBulkMail' },
          testSendBulkMail,
        ),
      );

      if (!response || response === '') {
        throw new RpcException('대량 메일 전송 처리 오류 발생');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response;
    } catch (error) {
      throw error;
    }
  }

  private async renameFile(
    filePath: FilePath,
    tempFolder: string,
    fileNames: string[],
  ) {
    if (!fileNames || fileNames.length <= 0) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, fileName] of fileNames.entries()) {
      if (this.configService.get<boolean>('USE_S3_STORAGE') === false) {
        if (existsSync(join(process.cwd(), tempFolder, fileName)) === false) {
          throw new BadRequestException(
            `선업로드되지 않은 파일 입니다. - ${fileName}`,
          );
        }
        await rename(
          join(process.cwd(), tempFolder, fileName),
          join(process.cwd(), 'public', filePath, fileName),
        );
      } else {
        this.commonService.saveMovieToPermanentStorage(fileName);
      }
    }
  }

  private async deleteFile(fileName: string) {
    try {
      if (this.configService.get<boolean>('USE_S3_STORAGE') === false) {
        await unlink(join(process.cwd(), fileName));
      } else {
        // TODO : S3에서 파일 삭제 처리
      }
    } catch (err) {
      console.error('파일 삭제 중 오류 발생 =>', err);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.logger.error(err.toString(), SignDocumentService.name);
    }
  }

  async createSignDocument(
    createSignDocumentDto: CreateSignDocumentDto,
    user: User,
    qr: QueryRunner,
  ) {
    const templates = await this.templatesService.findOneById(
      createSignDocumentDto.templatesId,
      user,
    );
    if (!templates) {
      throw new BadRequestException('생성된 Templates 정보가 없습니다.');
    }

    // 이미 해당 Templates에 관계된 SignDocument가 있는지 체크
    const signDocumentByTemplatesId = await this.signDocumentRepository.findOne(
      {
        where: {
          templates: { id: createSignDocumentDto.templatesId },
          createdBy: { id: user.id },
          isActive: true,
        },
      },
    );
    if (signDocumentByTemplatesId) {
      throw new BadRequestException('이미 기존에 생성된 문서가 존재 합니다.');
    }

    // 최종 PDF파일이 있는 경우 PDF파일 서명 처리
    if (createSignDocumentDto.editedFile) {
      const signLog = await this.signProcService.signByPDF(
        createSignDocumentDto.editedFile,
        user,
        createSignDocumentDto.pdfUserPassword,
        createSignDocumentDto.pdfOwnerPassword,
      );

      if (!signLog) {
        throw new InternalServerErrorException(
          'pdf파일 서명 처리 도중 오류가 발생하였습니다.',
        );
      } else {
        createSignDocumentDto.editedFile = signLog.signedPdfFileName;
        // editedFile이 있는 경우 editingStatus값 'complete'로 변경
        createSignDocumentDto.editingStatus = 'complete';
      }
    }

    const tempFolder = join('public', 'temp');
    // attachedFiles 선 업로드된 파일 처리
    if (createSignDocumentDto.attachedFiles) {
      await this.renameFile(
        'attachedFiles',
        tempFolder,
        createSignDocumentDto.attachedFiles,
      );
    }

    const saveSignDocumentDto = DtoBuilder.save(
      CreateSignDocumentDto,
      createSignDocumentDto,
      user,
    );

    const signDocument = await qr.manager
      .createQueryBuilder()
      .insert()
      .into(SignDocument)
      .values({
        ...saveSignDocumentDto,
        templates: templates,
      })
      .execute();

    // 템플릿 상태 변경 처리
    if (signDocument) {
      await this.templatesService.statusUpdate(
        createSignDocumentDto.templatesId,
        createSignDocumentDto.editingStatus,
        user,
      );
    }

    return signDocument;
  }

  async findOneById(id: number, user: User) {
    const signDocument = await this.signDocumentRepository.findOne({
      where: {
        id,
        createdBy: { id: user.id },
        isActive: true,
      },
      relations: ['createdBy', 'templates'],
    });

    return signDocument;
  }

  /**
   * Templates Id로 조회
   * @param templatesId Templates id
   * @param user 요청 사용자 정보
   * @returns SignDocument
   */
  async findOneByTemplatesId(templatesId: number, user: User) {
    const signDocument = await this.signDocumentRepository.findOne({
      where: {
        templates: { id: templatesId },
        createdBy: { id: user.id },
        isActive: true,
      },
    });

    if (!signDocument) {
      throw new BadRequestException('존재하지 않은 Templates id 입니다.');
    }

    return signDocument;
  }

  async updateSignDocument(
    signDocumentId: number,
    updateSignDocumentDto: UpdateSignDocumentDto,
    user: User,
    qr: QueryRunner,
  ) {
    // 01. 최종 PDF파일이 있는 경우 PDF파일 서명 처리
    if (updateSignDocumentDto.editedFile) {
      const signLog = await this.signProcService.signByPDF(
        updateSignDocumentDto.editedFile,
        user,
        updateSignDocumentDto.pdfUserPassword,
        updateSignDocumentDto.pdfOwnerPassword,
      );

      if (!signLog) {
        throw new InternalServerErrorException(
          'pdf파일 서명 처리 도중 오류가 발생하였습니다.',
        );
      } else {
        updateSignDocumentDto.editedFile = signLog.signedPdfFileName;
        // editedFile이 있는 경우 editingStatus값 'complete'로 변경
        updateSignDocumentDto.editingStatus = 'complete';
      }
    }

    // 02. 변경 대상 signDocument 데이터 찾기
    const oldSignDocument = await this.findOneById(signDocumentId, user);
    if (!oldSignDocument) {
      throw new BadRequestException('존재하지 않은 Document id 입니다.');
    }

    // 03. 추가된 선 업로드된 파일 처리
    const tempFolder = join('public', 'temp');
    // addedAttachedFiles 선 업로드된 파일 처리
    if (updateSignDocumentDto.addedAttachedFiles) {
      await this.renameFile(
        'attachedFiles',
        tempFolder,
        updateSignDocumentDto.addedAttachedFiles,
      );
    }

    // 04. 기존 업로드된 editedFile 삭제
    if (oldSignDocument.editedFile) {
      const tempFolder = join(
        'public',
        'signedPdf',
        oldSignDocument.editedFile,
      );
      await this.deleteFile(tempFolder);
    }

    // 04. 해당 SignDocument에 해당 되는 Templates 조회
    const templates = await this.templatesService.findOneById(
      oldSignDocument.templates.id,
      user,
    );
    if (!templates) {
      throw new BadRequestException('생성된 Templates 정보가 없습니다.');
    }
    // 04-01. UpdateSignDocumentDto 요청에 templatesId 값이 변경되어도 무시   [2025. 04. 17 엄태영]
    updateSignDocumentDto.templatesId = templates.id;

    // 05. 업데이트 상태로 dto 변경
    const signDocumentDto = DtoBuilder.update(
      CreateSignDocumentDto,
      updateSignDocumentDto,
      user,
    );

    // 06. RequestESign 객체 업데이트 정보로 반영
    Object.assign(oldSignDocument, signDocumentDto);
    // 06-01. addedAttachedFiles 정보가 있는 경우 기존 AttachedFiles에 병합
    if (updateSignDocumentDto.addedAttachedFiles) {
      const updateAttachedFiles = [
        ...(oldSignDocument.attachedFiles ?? []),
        ...updateSignDocumentDto.addedAttachedFiles,
      ];
      oldSignDocument.attachedFiles = updateAttachedFiles;
    }

    // 07. SignDocument 업데이트 반영
    await this.signDocumentRepository.save(oldSignDocument);

    // 08. 템플릿 상태 변경 처리
    if (updateSignDocumentDto.editingStatus) {
      await this.templatesService.statusUpdate(
        updateSignDocumentDto.templatesId,
        updateSignDocumentDto.editingStatus,
        user,
      );
    }

    return await qr.manager.findOne(SignDocument, {
      where: {
        id: signDocumentId,
      },
      relations: ['templates'],
    });
  }

  async deleteSignDocument(templateId: number, user: User) {
    const signDocument = await this.findOneByTemplatesId(templateId, user);

    if (!signDocument) {
      this.logger.log(
        '존재하지 않은 SignDocument 입니다.',
        SignDocumentService.name,
      );
      return;
    }

    signDocument.isDeleted = true;
    signDocument.isActive = false;
    signDocument.modifiedBy = user;

    return this.signDocumentRepository.save(signDocument);
  }
}
