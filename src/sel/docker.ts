import Docker from 'dockerode';
import { Container } from 'dockerode';

export class DockerService {
  private docker: Docker;
  private container: Container;
  constructor() {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    this.container = this.docker.getContainer('discord-bot-node');
  }

  public getLogs(since: number): Promise<string> {
    return this.container.logs({
      since: since,
      stdout: true,
      stderr: true,
    }).then(value => this.parseLog(value as any as Buffer));
  }

  private parseLog(buffer: Buffer): string {
    let log = '';
    let offset = 0;
    while (offset < buffer.length) {
      if (buffer.readInt8(offset) == 2) {
        log = log + '[ERROR] ';
      }
      const length = buffer.readUInt32BE(offset + 4);
      offset += 8;
      const end = offset + length;
      log = log + buffer.toString('utf-8', offset, end);
      offset = end;
    }
    return log;
  }
}
