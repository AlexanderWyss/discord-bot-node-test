import {By, Key, until, WebDriver} from "selenium-webdriver";
import {SearchTrackElement} from "./SearchTrack.element";

export class DiscordPage {
  public constructor(private driver: WebDriver){};

  public async search(text: string): Promise<SearchTrackElement[]> {
    const searchInput = await this.driver.findElement(By.css('#urlInput input'));
    await searchInput.click()
    await searchInput.sendKeys(text);
    await searchInput.sendKeys(Key.ENTER);
    return this.driver.wait(until.elementsLocated(By.css('#searchList app-track-info')), 10000)
      .then(elements => elements.map(element => new SearchTrackElement(element)));
  }

  async open(): Promise<void> {
    await this.driver.get('https://discord.wyss.tech/player/453485032204402688');
  }
}
