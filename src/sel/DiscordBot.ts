import {Client, VoiceChannel, VoiceConnection} from "discord.js";
import {onJenkins, wait} from "./assertions";

interface AudioAnalyzing {
  byteCount: number;
  average: number;
}

export class DiscordBot {
  private client: Client;
  private channel: VoiceChannel;
  private voiceConnection: VoiceConnection;

  public async start(): Promise<DiscordBot> {
    if (!onJenkins()) {
      require("dotenv").config();
    }
    this.client = new Client();
    await this.client.login(process.env.DISCORD_TOKEN)
    return this;
  }

  public async joinChannel(channelId: string) {
    await this.leave();
    this.channel = await this.client.channels.fetch(channelId) as VoiceChannel;
    this.voiceConnection = await this.channel.join();
  }

  public async leave() {
    if (this.channel) {
      await this.channel.leave();
      this.voiceConnection = undefined;
      this.channel = undefined;
    }
  }

  public async stop() {
    await this.leave();
    await this.client.destroy();
  }

  public async assertMusicPlaying(userId: string) {
    const audio = await this.getAverageValueFromStream(userId);
    expect(audio.byteCount).toBeGreaterThan(100000);
    expect(audio.average).toBeGreaterThan(70);
  }

  public async assertSilence(userId: string) {
    const audio = await this.getAverageValueFromStream(userId);
    if(audio.byteCount !== 0) {
      expect(audio.average).toBeLessThan(1);
    }
  }

  private async getAverageValueFromStream(userId: string): Promise<AudioAnalyzing> {
    let sum = 0;
    let counter = 0;
    const audio = this.voiceConnection.receiver.createStream(await this.client.users.fetch(userId), {
      mode: 'pcm',
      end: 'manual'
    });
    audio.on('data', (chunk: Buffer) => {
      for (const value of chunk) {
        sum += value;
      }
      counter += chunk.length;
    });
    await wait(5000);
    audio.destroy();
    return {
      byteCount: counter,
      average: sum / counter
    };
  }
}
