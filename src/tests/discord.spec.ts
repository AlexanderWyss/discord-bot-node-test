import {Driver} from "../sel/driver";
import {WebDriver} from "selenium-webdriver";
import {DiscordPage} from "../pages/discord.page";
import {DockerService} from "../sel/docker";
import {Track} from "../pages/Track";
import {SearchTrackElement} from "../pages/SearchTrack.element";

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
  const goldenBrown: Video = {
    title: 'Golden Brown - The Stranglers',
    artist: 'Μουσικές Περιηγήσεις',
    url: 'https://www.youtube.com/watch?v=AWAsI3U2EaE'
  };
  const queenMix: Video = {
    title: 'Queen & Freddie Mercury Best Songs (Official Videos)',
    artist: 'italianstyle983',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ&list=PLZYzh1QhBgMark6rrridAXQbozFrlxc12'
  };
  const dontStopMe: Video = {
    title: 'Queen - Don\'t Stop Me Now (Official Video)',
    artist: 'Queen Official',
    url: 'https://www.youtube.com/watch?v=HgzGwKwLmgM'
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
    const elements = await discord.search(bohemian.title);
    await assertTrack(elements[0], bohemian);
  });
  it('Play', async () => {
    const searchTrack = (await discord.getSearchResult())[0];
    await searchTrack.now();
    const currentlyPlaying = await discord.getCurrentlyPlaying();
    await assertTrack(currentlyPlaying, bohemian);
  });
  it('Add song for testing', async () => {
    const searchResult = await discord.getSearchResult();
    let searchTrack: SearchTrackElement;
    for (let i = 1; i < 20 && !searchTrack; i++) {
      if (!(await searchResult[i].isPlaylist())) {
        searchTrack = searchResult[i];
      }
    }
    expect(searchTrack).not.toBeNull();
    await searchTrack.next();
    const elements = await discord.getQueue();
    expect(elements.length).toBe(1);
  });
  it('Queue', async () => {
    const searchTrack = (await discord.search(bohemian.title))[0];
    await assertTrack(searchTrack, bohemian);
    await searchTrack.queue();
    const elements = await discord.getQueue(2);
    expect(elements.length).toBe(2);
    await assertTrack(elements[1], bohemian);
  });
  it('Next', async () => {
    const searchTrack = (await discord.search(brokenBones.title))[0];
    await assertTrack(searchTrack, brokenBones);
    await searchTrack.next();
    const elements = await discord.getQueue(3);
    expect(elements.length).toBe(3);
    await assertTrack(elements[0], brokenBones);
  });
  it('Skip', async () => {
    await discord.skip();
    const currentlyPlaying = await discord.getCurrentlyPlaying(/Broken Bones/);
    await assertTrack(currentlyPlaying, brokenBones);
  });
  it('Previous', async () => {
    await discord.previous();
    const currentlyPlaying = await discord.getCurrentlyPlaying(/Bohemian Rhapsody/);
    await assertTrack(currentlyPlaying, bohemian);
  });
  it('Search with URL', async () => {
    await discord.inputUrl(goldenBrown.url);
    const elements = await discord.getQueue(4);
    expect(elements.length).toBe(4);
    await assertTrack(elements[3], goldenBrown);
  });
  it('Browse Playlist', async () => {
    const searchPlaylist = (await discord.search(queenMix.title))[0];
    expect(await searchPlaylist.isPlaylist()).toBeTruthy();
    await assertTrack(searchPlaylist, queenMix);
    await searchPlaylist.browse();
    const searchResult = await discord.getSearchResult();
    expect(searchResult.length).toBeGreaterThan(25);
    await assertTrack(searchResult[0], bohemian);
    await assertTrack(searchResult[1], dontStopMe);
  });
  it('Queue in Playlist', async () => {
    const searchResult = await discord.getSearchResult();
    await searchResult[1].queue();
    const elements = await discord.getQueue(5);
    expect(elements.length).toBe(5);
    await assertTrack(elements[4], dontStopMe);
  });
  if (process.env.ON_JENKINS) {
    it('Verify Server Logs', async () => {
      const dockerService = new DockerService();
      const log = await dockerService.getLogs(testStartTimestamp);
      expect(log).toBe('');
    });
  }
});
