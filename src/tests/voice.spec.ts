import {DiscordPage} from "../pages/discord.page";
import {LogsAsserter, onJenkins, wait} from "../sel/assertions";
import {DiscordBot} from "../sel/DiscordBot";
import {bohemian} from "../assets/video";

jest.setTimeout(50000);

describe('Discord Voice', () => {
  let discord: DiscordPage;
  let logsAsserter: LogsAsserter;
  let discordBot: DiscordBot;
  const userId = '453639554575106048';
  const channelId = '453533151332007936';
  beforeAll(async () => {
    logsAsserter = new LogsAsserter().rememberTestStartTimestamp();
  });
  afterAll(async () => {
    try {
      await discord.stop();
    } finally {
      await discordBot.stop();
    }
  });
  it('Setup Discord Listening Test Bot', async () => {
    discordBot = await new DiscordBot().start();
    await discordBot.joinChannel(channelId);
  });
  it('Setup Discord Server Test Bot', async () => {
    discord = await DiscordPage.create();
    await discord.joinChannel('test');
  });
  it('Assert Silence', async () => {
    await wait(1000);
    await discordBot.assertSilence(userId);
  });
  it('Play', async () => {
    await discord.inputUrl(bohemian.url);
  });
  it('Listen', async () => {
    await wait(5000);
    await discordBot.assertMusicPlaying(userId);
  });
  if (onJenkins()) {
    it('Verify Server Logs', async () => {
      await logsAsserter.assert();
    });
  }
});
