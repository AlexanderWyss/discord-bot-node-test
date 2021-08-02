import {By, WebElement} from "selenium-webdriver";

export class SearchTrackElement {
  constructor(private element: WebElement) {
  }
  public getArtist(): Promise<string> {
    return this.element.findElement(By.css('.track-info small:first-of-type')).getText();
  }
  public async now(): Promise<void> {
    await this.button("Now");
  }
  public async next(): Promise<void> {
    await this.button("Next");
  }
  public async queue(): Promise<void> {
    await this.button("Queue");
  }
  public async radio(): Promise<void> {
    await this.button("Radio");
  }
  private async button(text: string) {
    await this.element.findElement(By.xpath(`//div[@class="buttons"]//button[span="${text}"]`)).click();
  }
}
