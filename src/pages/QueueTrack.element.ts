import {WebElement} from "selenium-webdriver";
import {TrackElement} from "./Track.element";

export class QueueTrackElement extends TrackElement {
  constructor(element: WebElement) {
    super(element);
  }

  public async remove(): Promise<void> {
    await this.button("delete");
  }
}
