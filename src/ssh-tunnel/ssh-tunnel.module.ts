import { Global, Module } from '@nestjs/common';
import { SshTunnelService } from './ssh-tunnel-service';

@Global()
@Module({
  providers: [SshTunnelService],
  exports: [SshTunnelService],
})
export class SshTunnelModule {}
