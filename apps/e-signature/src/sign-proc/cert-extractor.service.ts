import { ConfigService } from '@nestjs/config';
import forge from 'node-forge';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const PrivateKeyPath = join(process.cwd(), 'cert', 'private.key');

@Injectable()
export class CertExtractorService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 사이닝된 pdf 파일 시그니처로 공개키 추출
   * @param signature
   * @returns
   */
  extractPublicCert(signature) {
    // 서명 데이터를 PKCS#7 구조로 파싱
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const p7Asn1 = forge.asn1.fromDer(forge.util.createBuffer(signature));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const p7 = forge.pkcs7.messageFromAsn1(p7Asn1);

    // 인증서가 없는 경우
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!p7.certificates || p7.certificates.length === 0) {
      console.log('서명에 인증서가 없습니다.');
      return { publicKeyPem: null, certificateInfo: null };
    }

    // 첫 번째 인증서 가져오기
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const certificate = p7.certificates[0];

    // 인증서에서 공개키 추출
    // const publicKey = certificate.publicKey;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const publicKey = forge.pki.publicKeyToPem(certificate.publicKey);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return publicKey;
  }

  /**
   * 암호화 알고리즘으로 pdf 파일 시그니처 검증
   * @param signature
   * @returns
   */
  cryptographicVerification(signature) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const publicKey = this.extractPublicCert(signature);

    const secretText = 'oloBby';
    // pdf 파일에서 추출된 공개키로 secretText 문자열 암호화
    const buffer = Buffer.from(secretText);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    const encHex = encrypted.toString('hex');

    // 서버의 개인키로 secretText 문자열 복호화
    const privateKey = readFileSync(PrivateKeyPath, 'utf8');
    const bufferaa = Buffer.from(encHex, 'hex');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      bufferaa,
    );
    const decrpytedStr = decrypted.toString('utf8');

    return decrpytedStr === secretText;
  }

  extractCertificateData(fileBuffer: Buffer<ArrayBufferLike>) {
    const byteRangeList = this.getSignaturesByteRanges(fileBuffer);

    const CertificateDataList = byteRangeList.map((byteRange) => {
      const certificateData = this.getCertificateData(fileBuffer, byteRange);
      return certificateData;
    });

    return CertificateDataList;
  }

  getSignaturesByteRanges(fileBuffer: Buffer<ArrayBufferLike>) {
    const byteRangeList: number[][] = [];
    let byteRangeStart = 0;

    while ((byteRangeStart = fileBuffer.indexOf("/ByteRange [", byteRangeStart)) !== -1) {
      const byteRangeEnd = fileBuffer.indexOf(']', byteRangeStart);
      const byteRange = fileBuffer
        .subarray(byteRangeStart, byteRangeEnd + 1)
        .toString();
      const byteRangeMatch = /(\d+) +(\d+) +(\d+) +(\d+)/.exec(byteRange);

      if (byteRangeMatch) {
        const byteRangeArray = byteRangeMatch.slice(1, 5).map(Number); // Convert to integers
        // Add the ByteRange to the list
        byteRangeList.push(byteRangeArray);
      }

      // Move past the current ByteRange
      byteRangeStart = byteRangeEnd + 1;
    }

    return byteRangeList;
  }

  getSignature(
    fileBuffer: Buffer<ArrayBufferLike>,
    byteRange: Buffer<ArrayBufferLike>,
  ) {
    // Extract the specified range from the buffer
    const byteRangeBuffer = Buffer.from(
      fileBuffer.subarray(byteRange[1] + 1, byteRange[2] - 1),
    ).toString('binary');
    return Buffer.from(byteRangeBuffer, 'hex').toString('binary');
  }

  getSignedBuffer(
    fileBuffer: Buffer<ArrayBufferLike>,
    byteRange: Buffer<ArrayBufferLike>,
  ) {
    // Extract the specified range from the buffer
    const byteRangeBuffer = Buffer.concat([
      fileBuffer.subarray(byteRange[0], byteRange[0] + byteRange[1]),
      fileBuffer.subarray(byteRange[2], byteRange[2] + byteRange[3]),
    ]);

    return Buffer.from(byteRangeBuffer);
  }

  getMessageFromSignature(signature: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const p7Asn1 = forge.asn1.fromDer(signature, { parseAllBytes: false });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return forge.pkcs7.messageFromAsn1(p7Asn1);
  }

  signedDataHashHex(signedData: any, algorithm: any) {
    // Create a new hash object using the specified algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const md = forge.md[algorithm]
      .create()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      .update(signedData.toString('binary'));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const digest = md.digest().getBytes();
    return Buffer.from(digest).toString('hex');
  }

  verifyIntegrity(
    signatureMessage: any,
    signedData: Buffer<ArrayBuffer>,
  ): boolean {
    // Extract authenticated attributes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const attrs = signatureMessage.rawCapture.authenticatedAttributes;
    // Extract digest algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const digestAlgorithm = signatureMessage.rawCapture.digestAlgorithm;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashAlgorithmOid = forge.asn1.derToOid(digestAlgorithm);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashAlgorithm = forge.pki.oids[hashAlgorithmOid].toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const messageDigestAttr = forge.pki.oids.messageDigest;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const fullAttrDigest = attrs.find(
      (attr: { value: { value: any }[] }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        forge.asn1.derToOid(attr.value[0].value) === messageDigestAttr,
    );

    if (!fullAttrDigest) {
      console.error(
        'MessageDigest attribute not found in authenticated attributes.',
      );
      return false;
    }

    const attrDigest = Buffer.from(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      fullAttrDigest.value[1].value[0].value,
    ).toString('hex');

    const signedDataDigest = this.signedDataHashHex(signedData, hashAlgorithm);

    return signedDataDigest === attrDigest;
  }

  getSignedDataDigest(
    fileBuffer: Buffer<ArrayBufferLike>,
    byteRange: Buffer<ArrayBufferLike>,
  ) {
    const signatureBuffer = this.getSignature(fileBuffer, byteRange);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signatureMessage = this.getMessageFromSignature(signatureBuffer);

    // Extract digest algorithm
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const digestAlgorithm = signatureMessage.rawCapture.digestAlgorithm;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashAlgorithmOid = forge.asn1.derToOid(digestAlgorithm);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const hashAlgorithm = forge.pki.oids[hashAlgorithmOid].toLowerCase();

    const signedBuffer = this.getSignedBuffer(fileBuffer, byteRange);
    const signedDataDigest = this.signedDataHashHex(
      signedBuffer,
      hashAlgorithm,
    );

    return signedDataDigest;
  }

  verifyExpiration(certificate: any) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      certificate.validity.notAfter.getTime() < Date.now() ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      certificate.validity.notBefore.getTime() > Date.now()
    );
  }

  mapAttributes(attrs) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return attrs.reduce((item, { name, value }) => {
      if (name) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        item[name] = value;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item;
    }, {});
  }

  extractCertificateDetails(message) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const certificate = message.certificates[0];

    if (!certificate) {
      return;
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      issuedBy: this.mapAttributes(certificate.issuer.attributes),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      issuedTo: this.mapAttributes(certificate.subject.attributes),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      validityPeriod: certificate.validity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      pemCertificate: forge.pki.certificateToPem(certificate),
      isExpired: this.verifyExpiration(certificate),
    };
  }

  getCertificateData(fileBuffer, byteRange) {
    const signatureBuffer = this.getSignature(fileBuffer, byteRange);
    const signedBuffer = this.getSignedBuffer(fileBuffer, byteRange);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signatureMessage = this.getMessageFromSignature(signatureBuffer);
    const certificateData = this.extractCertificateDetails(signatureMessage);

    // certificateData.validIntegrity = this.verifyIntegrity(signatureMessage, signedBuffer);

    return { certificateData };
  }
}
