import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { existsSync } from 'node:fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import signpdf from '@signpdf/signpdf';
import { plainAddPlaceholder } from '@signpdf/placeholder-plain';
import { P12Signer } from '@signpdf/signer-p12';
import { extractSignature } from '@signpdf/utils';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { CertExtractorService } from './cert-extractor.service';
import { PDFVerifyDto } from './dto/pdf-verify.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectRepository } from '@nestjs/typeorm';
import { SignLog } from './entities/sign-log.entity';
import { Repository } from 'typeorm';
import { CreateSignLogDto } from './dto/create-sign-log.dto';
import { DtoBuilder } from 'src/common/dto/dto-builder';

const P12Path = join(process.cwd(), 'cert', 'certificate.p12');

@Injectable()
export class SignProcService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly certExtractorService: CertExtractorService,
    @InjectRepository(SignLog)
    private readonly signLogRepository: Repository<SignLog>,
  ) {}

  addPlaceholderToPdf(pdfFile: string): Buffer<ArrayBufferLike> {
    // 원본 PDF 불러오기
    const pdfBuffer = readFileSync(pdfFile);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const pdfWithPlaceholder: Buffer<ArrayBufferLike> = plainAddPlaceholder({
      pdfBuffer,
      reason: 'E-sign PDF signatures',
      contactInfo: 'support@olobby.co.kr',
      name: 'olobby',
      location: 'Seoul, Korea',
    });

    console.log('✅ PDF에 서명 Placeholder 추가 완료');
    return pdfWithPlaceholder;
  }

  async signByPDF(pdfFile: string, user: User) {
    const pdfFilePath = join(process.cwd(), 'public', 'signPdf', pdfFile);
    if (existsSync(pdfFilePath) === false) {
      throw new BadRequestException(
        `존재하지 않은 PDF 파일 입니다. - ${pdfFile}`,
      );
    }

    this.logger.log('pdf 파일 서명 시작!', SignProcService.name);

    // PDF에 빈 서명 필드 추가
    const pdfWithPlaceholder = this.addPlaceholderToPdf(pdfFilePath);

    const signer = new P12Signer(readFileSync(P12Path), {
      passphrase: this.configService.get<string>('P12_PASSWORD'),
    });

    // PDF에 전자 서명
    const signedPdf = await signpdf.sign(pdfWithPlaceholder, signer);
    this.logger.log('pdf 파일 서명 완료!', SignProcService.name);

    // 서명된 PDF 저장
    const signedPdfPath = join(
      process.cwd(),
      'public',
      'signedPdf',
      `(${user.userGuid})${pdfFile}`,
    );
    writeFileSync(signedPdfPath, signedPdf);
    await unlink(pdfFilePath);
    console.log('pdf 싸인 완료 후 파일 삭제!');
    console.log(`${pdfFilePath} => ${signedPdfPath}`);

    this.logger.log('pdf 파일 서명 저장 완료!', SignProcService.name);
    this.logger.log(
      `pdf file => (${user.userGuid})${pdfFile}`,
      SignProcService.name,
    );

    // 서명 이력 DB insert
    const signedDataDigest = this.getSignedDataDigest(signedPdf, user);
    const createSignLogDto = new CreateSignLogDto();
    const saveSignLogDto = DtoBuilder.save(
      CreateSignLogDto,
      createSignLogDto,
      user,
    );
    saveSignLogDto.signedPdfFileName = `(${user.userGuid})${pdfFile}`;
    saveSignLogDto.signedDataDigest = signedDataDigest;

    const signLog = await this.signLogRepository.save({
      ...saveSignLogDto,
    });

    this.logger.log(
      `pdf 파일 서명 이력 DB insert => id : ${signLog.id}`,
      SignProcService.name,
    );

    return signLog;
  }

  /**
   * 사이닝 완료된 pdf 파일의 시그니처 해시 값
   * @param pdfBuffer 사이닝된 pdf 파일 버퍼
   * @param user 유저 데이터
   * @returns 시그니처 해시 값
   */
  getSignedDataDigest(pdfBuffer: Buffer<ArrayBufferLike>, user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { ByteRange } = extractSignature(pdfBuffer);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.certExtractorService.getSignedDataDigest(pdfBuffer, ByteRange);
  }

  async verify(
    pdfBuffer: Buffer<ArrayBufferLike>,
    user: User,
  ): Promise<PDFVerifyDto> {
    const pdfVerifyDto: PDFVerifyDto = new PDFVerifyDto();

    try {
      const signedDataDigest = this.getSignedDataDigest(pdfBuffer, user);

      // DB에서 signedDataDigest 찾기
      const queryBuilder = this.signLogRepository.createQueryBuilder('sign_log');
      // queryBuilder.where('sign_log.createdBy = :createdBy', {
      //   createdBy: user.id,
      // });
      queryBuilder.where('sign_log.signedDataDigest = :signedDataDigest', {
        signedDataDigest: signedDataDigest,
      });
      queryBuilder.andWhere('sign_log.isActive = true');

      const signLog = await queryBuilder.getOne();
      if (!signLog) {
        this.logger.log(
          '해당 시그니처 해시값으로 서명된 이력 없음',
          SignProcService.name,
        );
        throw new BadRequestException('서명한 이력이 없습니다.');
      }

      this.logger.log('pdf 파일 서명 검증 시작!', SignProcService.name);

      // 01. pdf 파일에서 서명 데이터 추출

      // const { ByteRange, signature, signedData } = extractSignature(pdfBuffer);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { ByteRange, signature, signedData } = extractSignature(pdfBuffer);
      if (!ByteRange || !signature || !signedData) {
        console.log('서명 데이터를 찾을 수 없습니다.');
        throw new BadRequestException('서명 데이터를 찾을 수 없습니다.');
      }

      // // 02. 서명 정보 추출
      // const signature = this.certExtractorService.getSignature(
      //   pdfBuffer,
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      //   ByteRange,
      // );
      // const signedBuffer = this.certExtractorService.getSignedBuffer(
      //   pdfBuffer,
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      //   ByteRange,
      // );

      // if (!signature || !signedBuffer) {
      //   console.log('서명 정보를 찾을 수 없습니다.');
      //   throw new BadRequestException('서명 정보를 찾을 수 없습니다.');
      // }

      // 02. pdf에서 인증서 추출
      const pdfCert =
        this.certExtractorService.extractCertificateData(pdfBuffer);
      if (!pdfCert || pdfCert.length <= 0) {
        console.log('pdf 파일에서 인증서를 찾을 수 없습니다.');
        throw new BadRequestException(
          'pdf 파일에서 인증서를 찾을 수 없습니다.',
        );
      }

      if (pdfCert[0].certificateData!.isExpired === true) {
        console.log('만료된 인증서 입니다.');
        throw new BadRequestException('만료된 인증서 입니다.');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (pdfCert[0].certificateData!.issuedBy.organizationName !== 'olobby') {
        console.log('잘못된 인증서 입니다.');
        throw new BadRequestException('잘못된 인증서 입니다.');
      }

      // 04. 시그니처로 공개키 추출 후 암복호화 검증
      // 서버의 Private key로 생성한 p12 인증서로 사이닝한 pdf 파일이 맞는지 확인
      // [추출된 Public key로 암호화 -> 서버 Private key호 복호화]
      const cryptoValid =
        this.certExtractorService.cryptographicVerification(signature);
      this.logger.log(
        `시그니처 공개키 암복호화 검증 결과 => ${cryptoValid}`,
        SignProcService.name,
      );
      if (!cryptoValid) {
        throw new BadRequestException('olobby 발급 서명 파일이 아닙니다.');
      }

      // 05. 시그니처 검증
      const signatureBuffer = this.certExtractorService.getSignature(
        pdfBuffer,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ByteRange,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const signatureMessage =
        this.certExtractorService.getMessageFromSignature(signatureBuffer);
      const isValid = this.certExtractorService.verifyIntegrity(
        signatureMessage,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        signedData,
      );
      this.logger.log(`시그니처 검증 결과 => ${isValid}`, SignProcService.name);
      if (!isValid) {
        throw new BadRequestException('컨텐츠가 위.변조 되었습니다.');
      }

      pdfVerifyDto.certValidity = true;
      pdfVerifyDto.certValidityPeriod = new Date(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        pdfCert[0].certificateData!.validityPeriod.notAfter,
      );
      pdfVerifyDto.forgery = cryptoValid && isValid;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      pdfVerifyDto.signer =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pdfCert[0].certificateData!.issuedBy.organizationName;

      if (!cryptoValid) pdfVerifyDto.error = '정상적인 서명 파일이 아닙니다.';
      if (!isValid) pdfVerifyDto.error = '컨텐츠가 변조 되었습니다.';

      return pdfVerifyDto;
    } catch (error) {
      this.logger.error('pdf 파일 서명 검증 오류', error, SignProcService.name);
      console.log(error);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      pdfVerifyDto.error = error.message;
      pdfVerifyDto.certValidity = false;
      return pdfVerifyDto;
    }
  }
}
