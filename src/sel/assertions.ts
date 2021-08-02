import {Track} from "../pages/Track";
import {Video} from "../assets/video";
import {DockerService} from "./docker";

export async function assertTrack(track: Track, video: Video) {
  expect(await track.getTitle()).toBe(video.title);
  expect(await track.getArtist()).toBe(video.artist);
}
export class LogsAsserter {
  private testStartTimestamp: number;
  public rememberTestStartTimestamp(): LogsAsserter {
    this.testStartTimestamp = Math.floor(Date.now() / 1000);
    return this;
  }
  public async assert() {
    const dockerService = new DockerService();
    const log = await dockerService.getLogs(this.testStartTimestamp);
    expect(log).toBe('');
  }
}
export function onJenkins(): boolean {
  return !!process.env.ON_JENKINS;
}

export async function wait(ms: number) {
  await new Promise(resolve => {setTimeout(() => resolve('OK'), ms)});
}
