import {Driver} from "../sel/driver";
import {WebDriver} from "selenium-webdriver";
import {DiscordPage} from "../pages/discord.page";

describe('Discord', () => {
  let driver: WebDriver;
  let discord: DiscordPage;
  beforeAll(async () => {
    driver = await Driver.start();
    discord = new DiscordPage(driver);
    await discord.open();
  });
  afterAll(async () => {
    await discord.leave();
    await Driver.stop();
  })
  it('Join Channel', async () => {
    await discord.joinChannel('test');
  });
  it('Test', async () => {
    await discord.search('Bohemian rapsody');
    const elements = await discord.search('Broken Bones');
    expect(await elements[0].getArtist()).toBe('KALEO');
  });
});
