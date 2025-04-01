import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { TokenResponseDto } from './dto/token-response.dto';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  parseBasicToken(rawToken: string) {
    // 1. ['Basic', $token]
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    // 2. decode base64 [email, password]
    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    // 3. split token
    // "email:password"
    // [email, password]
    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
    }

    const [email, password] = tokenSplit;

    return {
      email,
      password,
    };
  }

  async getToken(jsonData: string): Promise<TokenResponseDto | null> {
    const tokenServerUrl = this.configService.get<string>('TOKEN_SERVER_URL');
    const tokenServerEndpoint = 'api/GetToken';
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const { data, status } = await firstValueFrom(
      this.httpService
        .post<TokenResponseDto>(
          `${tokenServerUrl}${tokenServerEndpoint}`,
          jsonData,
          options,
        )
        .pipe(
          catchError((error) => {
            throw error;
          }),
        ),
    );

    if (status == 200) {
      return plainToInstance(TokenResponseDto, data, {
        excludeExtraneousValues: true,
      });
    } else {
      return null;
    }
  }

  async signIn(token: string) {
    const { email, password } = this.parseBasicToken(token);
    let user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('로그인에 실패했습니다!');
    }

    const jsonData = JSON.stringify({
      Email: email,
      Password: password,
      PwdType: 2,
    });
    const tokenData = await this.getToken(jsonData);
    if (!tokenData) {
      throw new UnauthorizedException('로그인에 실패했습니다!');
    }

    user = await this.usersService.getUserByGuid(tokenData.model.user.userId);
    return { user, token: tokenData.model.token };
  }
}
