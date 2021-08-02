import {Driver} from "../sel/driver";
import {WebDriver} from "selenium-webdriver";
import {DiscordPage} from "../pages/discord.page";

jest.setTimeout(50000);
describe('Discord', () => {
  let driver: WebDriver;
  let discord: DiscordPage;
  beforeAll(async () => {
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
    // TODO check no error
    const currentlyPlaying = await discord.getCurrentlyPlaying();
    expect(await currentlyPlaying.getTitle()).toBe('KALEO "Broken Bones" [Official Audio]');
    expect(await currentlyPlaying.getArtist()).toBe('KALEO');
  });
});
