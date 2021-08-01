import {Builder, WebDriver} from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

export class Driver {
  private static driver: WebDriver;

  public static async start(): Promise<WebDriver> {
    if (!this.driver) {
      const serviceBuilder = new firefox.ServiceBuilder("geckodriver.exe");
      this.driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxService(serviceBuilder)
        .build();
    }
    return this.driver;
  }

  public static async stop() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}
