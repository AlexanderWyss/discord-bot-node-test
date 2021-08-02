import {Driver} from "../sel/driver";
import {WebDriver} from "selenium-webdriver";
import {DiscordPage} from "../pages/discord.page";
import {DockerService} from "../sel/docker";

jest.setTimeout(50000);
describe('Discord', () => {
  let driver: WebDriver;
  let discord: DiscordPage;
  let testStartTimestamp: number;
  beforeAll(async () => {
    testStartTimestamp = Math.floor(Date.now() / 1000);
    driver = await Driver.start();
    discord = new DiscordPage(driver);
    await discord.open();
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
    await discord.search('Bohemian rapsody');
    const elements = await discord.search('Broken Bones');
    expect(await elements[0].getArtist()).toBe('KALEO');
  });
  it('Play', async () => {
    await discord.clear();
    await (await discord.getSearchResult())[0].now();
    const currentlyPlaying = await discord.getCurrentlyPlaying();
    expect(await currentlyPlaying.getTitle()).toBe('KALEO "Broken Bones" [Official Audio]');
    expect(await currentlyPlaying.getArtist()).toBe('KALEO');
  });
  it('Verify Server Logs', async () => {
    let dockerService = new DockerService();
    let log = await dockerService.getLogs(testStartTimestamp);
    expect(log).toBe('');
  });
});
