import {Driver} from "../sel/driver";
import {WebDriver} from "selenium-webdriver";
import {DiscordPage} from "../pages/discord.page";
import {DockerService} from "../sel/docker";
import {Track} from "../pages/Track";

jest.setTimeout(50000);

interface Video {
  title: string;
  artist: string;
  url: string;
}

async function assertTrack(track: Track, video: Video) {
  expect(await track.getTitle()).toBe(video.title);
  expect(await track.getArtist()).toBe(video.artist);
}

describe('Discord', () => {
  let driver: WebDriver;
  let discord: DiscordPage;
  let testStartTimestamp: number;
  const brokenBones: Video = {
    title: 'KALEO "Broken Bones" [Official Audio]',
    artist: 'KALEO',
    url: 'https://www.youtube.com/watch?v=NOletMMI0B4'
  };
  const bohemian: Video = {
    title: 'Queen – Bohemian Rhapsody (Official Video Remastered)',
    artist: 'Queen Official',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
  };
  beforeAll(async () => {
    testStartTimestamp = Math.floor(Date.now() / 1000);
    driver = await Driver.start();
    discord = new DiscordPage(driver);
    await discord.open();
    await discord.clear();
  });
  afterAll(async () => {
    try {
      await discord.clear();
      await discord.leave();
    } finally {
      await driver.quit();
    }
  })
  it('Join Channel', async () => {
    await discord.joinChannel('test');
  });
  it('Search', async () => {
    const elements = await discord.search(brokenBones.title);
    await assertTrack(elements[0], brokenBones);
  });
  it('Play', async () => {
    await (await discord.getSearchResult())[0].now();
    const currentlyPlaying = await discord.getCurrentlyPlaying();
    await assertTrack(currentlyPlaying, brokenBones);
  });
  it('Add song for testing', async () => {
    await (await discord.getSearchResult())[5].next();
    const elements = await discord.getQueue();
    expect(elements.length).toBe(1);
    expect(await elements[0].getTitle()).not.toBe(brokenBones.title);
  });
  it('Queue', async () => {
    await (await discord.search(bohemian.title))[0].queue();
    const elements = await discord.getQueue(2);
    expect(elements.length).toBe(2);
    await assertTrack(elements[1], bohemian);
  });
  it('Next', async () => {
    await (await discord.search(brokenBones.title))[0].next();
    const elements = await discord.getQueue(3);
    expect(elements.length).toBe(3);
    await assertTrack(elements[0], brokenBones);
  });
  if (process.env.ON_JENKINS) {
    it('Verify Server Logs', async () => {
      const dockerService = new DockerService();
      const log = await dockerService.getLogs(testStartTimestamp);
      expect(log).toBe('');
    });
  }
});
