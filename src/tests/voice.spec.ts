import {DiscordPage} from "../pages/discord.page";
import {LogsAsserter, onJenkins} from "../sel/assertions";

jest.setTimeout(50000);

describe('Discord Voice', () => {
  let discord: DiscordPage;
  let logsAsserter: LogsAsserter;
  beforeAll(async () => {
    logsAsserter = new LogsAsserter().rememberTestStartTimestamp();
    discord = await DiscordPage.create();
  });
  afterAll(async () => {
    await discord.stop();
  })
  it('Join Channel', async () => {
    await discord.joinChannel('test');
  });
  if (onJenkins()) {
    it('Verify Server Logs', async () => {
      await logsAsserter.assert();
    });
  }
});
