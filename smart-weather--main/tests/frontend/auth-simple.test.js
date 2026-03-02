const { createDriver, waitForElement, takeScreenshot, BASE_URL } = require('./setup');

describe('Simple Auth Test', () => {
  let driver;

  beforeEach(async () => {
    driver = await createDriver();
  }, 30000);

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  }, 30000);

  test('should load login page', async () => {
    await driver.get(`${BASE_URL}/login`);
    await driver.sleep(2000);
    
    const heading = await waitForElement(driver, 'h2');
    const text = await heading.getText();
    
    expect(text).toBe('Login');
    await takeScreenshot(driver, 'simple-auth-test');
  }, 30000);
});
