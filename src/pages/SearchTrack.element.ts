import {WebElement} from "selenium-webdriver";
import {TrackElement} from "./Track.element";

export class SearchTrackElement extends TrackElement {
  constructor(element: WebElement) {
    super(element);
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

  public async isPlaylist(): Promise<boolean> {
    return (await this.element.findElements(this.buttonXpath("Browse"))).length !== 0;
  }
  public async browse(): Promise<void> {
    await this.button("Browse");
  }
}
