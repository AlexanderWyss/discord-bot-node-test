import {By, WebElement, WebElementPromise} from "selenium-webdriver";

export class CurrentlyPlayingElement {
  constructor(private element: WebElement) {
  }
  public getTitle(): Promise<string> {
    return this.getTitleElement().getText();
  }
  public getArtist(): Promise<string> {
    return this.element.findElement(By.css('small:first-of-type')).getText();
  }

  getTitleElement(): WebElementPromise {
    return this.element.findElement(By.css('h3'));
  }
}
