import {By, WebElement} from "selenium-webdriver";

export class SearchTrackElement {
  constructor(private element: WebElement) {
  }
  public getArtist(): Promise<string> {
    return this.element.findElement(By.css('.track-info small:first-of-type')).getText();
  }
}
