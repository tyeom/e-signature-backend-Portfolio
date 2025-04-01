import { Module } from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { TeammateController } from './teammate.controller';

@Module({
  controllers: [TeammateController],
  providers: [TeammateService],
})
export class TeammateModule {}
