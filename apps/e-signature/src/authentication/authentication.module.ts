import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, HttpModule, JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [JwtModule, HttpModule],
})
export class AuthenticationModule {}
