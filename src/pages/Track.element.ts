import {By, WebElement} from "selenium-webdriver";
import {Track} from "./Track";

export abstract class TrackElement implements Track {
  protected constructor(protected element: WebElement) {
  }

  public getTitle(): Promise<string> {
    return this.element.findElement(By.css('.track-info h3')).getText();
  }

  public getArtist(): Promise<string> {
    return this.element.findElement(By.css('.track-info small:first-of-type')).getText();
  }

  public getDuration(): Promise<string> {
    return this.element.findElement(By.css('.track-info small:last-of-type')).getText();
  }

  protected async button(text: string) {
    await this.element.findElement(this.buttonXpath(text)).click();
  }

  protected buttonXpath(text: string) {
    return By.xpath(`.//div[@class="buttons"]//button[span="${text}"]`);
  }
}
