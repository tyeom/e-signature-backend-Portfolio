import { Injectable } from '@nestjs/common';
import { createTunnel } from 'tunnel-ssh';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SshTunnelService {
  private server: any;

  constructor(private readonly configService: ConfigService) {}

  async createSSHTunnel() {
    const tunnelOptions = {
      autoClose: true,
      reconnectOnError: true,
    };

    const serverOptions = {
      port: parseInt(this.configService.get('DB_PORT') || '5432'),
    };

    const sshOptions = {
      host: this.configService.get<string>('SSH_HOST'),
      port: 22,
      username: this.configService.get<string>('SSH_USERNAME'),
      password: this.configService.get<string>('SSH_PASSWORD'),
    };

    const forwardOptions = {
      srcAddr: this.configService.get<string>('SSH_HOST'),
      srcPort: parseInt(this.configService.get('DB_PORT') || '5432'),
      dstAddr: this.configService.get<string>('DB_HOST'),
      dstPort: parseInt(this.configService.get('DB_PORT') || '5432'),
    };

    const [server] = await createTunnel(
      tunnelOptions,
      serverOptions,
      sshOptions,
      forwardOptions,
    );

    this.server = server;

    server.on('connection', (connection) => {
      console.log('DB Server 터널링 연결됨!', connection.address());
    });
  }
}
