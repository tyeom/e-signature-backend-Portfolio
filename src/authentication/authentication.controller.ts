import { Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Authorization } from './decorator/authorization.decorator';
import { Public } from './decorator/public.decorator';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @ApiBasicAuth()
  @Post('sign-in')
  signIn(@Authorization() token: string) {
    try {
      return this.authenticationService.signIn(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
