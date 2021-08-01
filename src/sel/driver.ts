import {Builder, Capabilities, WebDriver} from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

export class Driver {
  private static driver: WebDriver;

  public static async start(): Promise<WebDriver> {
    if (!this.driver) {
      if (process.env.ON_JENKINS) {
        this.driver = await new Builder()
          .usingServer("http://localhost:4444")
          .withCapabilities(Capabilities.firefox())
          .forBrowser('firefox')
          .setFirefoxService(new firefox.ServiceBuilder("geckodriver"))
          .setFirefoxOptions(new firefox.Options().headless())
          .build();
      } else {
        this.driver = await new Builder()
          .forBrowser('firefox')
          .setFirefoxService(new firefox.ServiceBuilder("geckodriver.exe"))
          .build();
      }
    }
    return this.driver;
  }

  public static async stop() {
    if (this.driver) {
      await this.driver.quit();
    }
  }
}
