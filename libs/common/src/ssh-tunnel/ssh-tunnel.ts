import { Injectable } from '@nestjs/common';
import { createTunnel } from 'tunnel-ssh';

export interface ServerOptions {
  port: number;
}

export interface SshOptions {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface ForwardOptions {
  srcAddr: string;
  srcPort: number;
  dstAddr: string;
  dstPort: number;
}

@Injectable()
export class SshTunnel {
  private server: any;

  constructor(
    private readonly serverOptions: ServerOptions,
    private readonly sshOptions: SshOptions,
    private readonly forwardOptions: ForwardOptions,
  ) {}

  async createSSHTunnel() {
    const tunnelOptions = {
      autoClose: true,
      reconnectOnError: true,
    };
    const [server] = await createTunnel(
      tunnelOptions,
      this.serverOptions,
      this.sshOptions,
      this.forwardOptions,
    );

    this.server = server;

    server.on('connection', (connection) => {
      console.log('DB Server 터널링 연결됨!', connection.address());
    });
  }
}
