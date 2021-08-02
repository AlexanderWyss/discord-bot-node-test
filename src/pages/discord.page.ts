import {By, Key, until, WebDriver} from "selenium-webdriver";
import {SearchTrackElement} from "./SearchTrack.element";
import {CurrentlyPlayingElement} from "./CurrentlyPlaying.element";

export class DiscordPage {
  public constructor(private driver: WebDriver){};

  public async search(text: string): Promise<SearchTrackElement[]> {
    const searchInput = await this.driver.findElement(By.css('#urlInput input'));
    await searchInput.click()
    await searchInput.sendKeys(text);
    await searchInput.sendKeys(Key.ENTER);
    return this.getSearchResult();
  }

  public getSearchResult(): Promise<SearchTrackElement[]> {
    return this.driver.wait(until.elementsLocated(By.css('#searchList app-track-info')), 10000)
      .then(elements => elements.map(element => new SearchTrackElement(element)));
  }

  public async getCurrentlyPlaying(): Promise<CurrentlyPlayingElement> {
    const currentlyPlayingElement = new CurrentlyPlayingElement(await this.driver.findElement(By.id('currentTrackInfo')));
    await this.driver.wait(until.elementTextMatches(currentlyPlayingElement.getTitleElement(), /.+/), 10000)
    return currentlyPlayingElement;
  }

  public async joinChannel(channel: string): Promise<void> {
    await this.driver.findElement(By.xpath('//div[@id="title-container"]//button[span="Channels"]')).click();
    await this.driver.findElement(By.xpath(`//app-join-channel//button[span="${channel}"]`)).click();
  }

  public async leave(): Promise<void> {
    await this.driver.findElement(By.xpath('//div[@id="title-container"]//button[span="Leave"]')).click();
  }

  public async open(): Promise<void> {
    await this.driver.get('https://discord.wyss.tech/player/453485032204402688');
  }

  public async clear() {
    await this.driver.findElement(By.xpath('//div[@id="currentTrackInfo"]//button[span="delete_sweep"]')).click();
    await this.driver.findElement(By.xpath('//app-clear-playlist//button[@id="done-button"]')).click();
  }
}
