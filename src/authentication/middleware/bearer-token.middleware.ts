import { HttpService } from '@nestjs/axios';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as xml2js from 'xml2js';
import * as forge from 'node-forge';
import { NextFunction, Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 토큰 서버에서 JWT Secret Key (공개키) 가져와 캐시에 저장
   */
  async fetchPublicKey() {
    try {
      const tokenServerUrl = this.configService.get<string>('TOKEN_SERVER_URL');
      const tokenServerEndpoint = 'api/PublicKeyXml';
      const response = await firstValueFrom(
        this.httpService.get(`${tokenServerUrl}${tokenServerEndpoint}`),
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const xmlData = response.data;

      // XML을 파싱
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const parser = new xml2js.Parser({ explicitArray: false });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const result = await parser.parseStringPromise(xmlData);
      // RSA 공개키 구성요소 추출
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const modulus = result.RSAKeyValue.Modulus;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const exponent = result.RSAKeyValue.Exponent;

      // Base64 디코딩 및 forge RSA 공개키 생성
      const modulusBuffer = Buffer.from(modulus, 'base64');
      const exponentBuffer = Buffer.from(exponent, 'base64');

      const modulusHex = modulusBuffer.toString('hex');
      const exponentHex = exponentBuffer.toString('hex');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const rsaPublicKey = forge.pki.rsa.setPublicKey(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        new forge.jsbn.BigInteger(modulusHex, 16),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        new forge.jsbn.BigInteger(exponentHex, 16),
      );
      // PEM 형식으로 변환
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const publicKey = forge.pki.publicKeyToPem(rsaPublicKey);
      // 캐시 한달 유효기간
      await this.cacheManager.set('publicKey', publicKey, 60 * 60 * 24 * 30);
      console.log('RSA 공개키 로드 완료');
    } catch (error) {
      console.error('RSA 공개키 로드 실패:', error);
      throw error;
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    /// Basic $token
    /// Bearer $token
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      next();
      return;
    }

    const token = this.validateBearerToken(authHeader);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
    const decodedPayload = this.jwtService.decode(token);

    try {
      let publicKey = await this.cacheManager.get('publicKey');
      if (!publicKey) {
        await this.fetchPublicKey();
        publicKey = await this.cacheManager.get('publicKey');
      }
      // 토큰 공개키로 검증
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: publicKey as string,
        algorithms: ['RS256'],
      });

      // 실제 user정보 조회 후 request에 담음.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const user = await this.usersService.getUserByGuid(payload.UserId);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (req as any).user = user;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      (req as any).tokenPayload = payload;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('토큰이 만료됐습니다.');
      }
    }
    next();
  }

  validateBearerToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [bearer, token] = basicSplit;

    if (bearer.toLowerCase() !== 'bearer') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    return token;
  }
}
