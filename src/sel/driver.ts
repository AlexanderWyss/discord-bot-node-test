import {Builder, WebDriver} from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";

export class Driver {
  private static driver: WebDriver;

  public static async start(): Promise<WebDriver> {
    if (!this.driver) {
      let geckoPath;
      let options;
      if (process.env.ON_JENKINS) {
        geckoPath = 'geckodriver';
        options = new firefox.Options().headless();
      } else {
        geckoPath = "geckodriver.exe";
        options = new firefox.Options();
      }
      const serviceBuilder = new firefox.ServiceBuilder(geckoPath);
      this.driver = await new Builder()
        .forBrowser('firefox')
        .setFirefoxService(serviceBuilder)
        .setFirefoxOptions(options)
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
