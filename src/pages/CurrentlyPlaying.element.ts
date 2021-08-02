import {By, WebElement, WebElementPromise} from "selenium-webdriver";
import {Track} from "./Track";

export class CurrentlyPlayingElement implements Track {
  constructor(private element: WebElement) {
  }

  public getTitle(): Promise<string> {
    return this.getTitleElement().getText();
  }

  public getArtist(): Promise<string> {
    return this.element.findElement(By.css('small:first-of-type')).getText();
  }

  public getDuration(): Promise<string> {
    return this.element.findElement(By.css('small:last-of-type')).getText();
  }

  getTitleElement(): WebElementPromise {
    return this.element.findElement(By.css('h3'));
  }
}
