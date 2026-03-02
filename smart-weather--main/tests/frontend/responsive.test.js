const { createDriver, waitForElement, takeScreenshot, BASE_URL } = require('./setup');

describe('Responsive Design Tests', () => {
  let driver;

  beforeEach(async () => {
    driver = await createDriver();
  }, 30000);

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
      } catch (e) {
        console.log('Driver already closed');
      }
    }
  }, 30000);

  test('should display correctly on mobile viewport (375px)', async () => {
    await driver.get(BASE_URL);
    
    // Set mobile viewport
    await driver.manage().window().setRect({ width: 375, height: 812 });
    await driver.sleep(1000);
    
    // Check if elements are visible
    const header = await waitForElement(driver, '.navbar-brand');
    expect(await header.isDisplayed()).toBe(true);
    
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    expect(await searchInput.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'mobile-375px');
  }, 30000);

  test('should display correctly on tablet viewport (768px)', async () => {
    await driver.get(BASE_URL);
    
    // Set tablet viewport
    await driver.manage().window().setRect({ width: 768, height: 1024 });
    await driver.sleep(1000);
    
    const header = await waitForElement(driver, '.navbar-brand');
    expect(await header.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'tablet-768px');
  }, 30000);

  test('should display correctly on desktop viewport (1920px)', async () => {
    await driver.get(BASE_URL);
    
    // Set desktop viewport
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.sleep(1000);
    
    const header = await waitForElement(driver, '.navbar-brand');
    expect(await header.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'desktop-1920px');
  }, 30000);

  test('should display weather card responsively on mobile', async () => {
    await driver.get(BASE_URL);
    
    // Set mobile viewport
    await driver.manage().window().setRect({ width: 375, height: 812 });
    
    // Search for a city
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('London');
    
    const searchButton = await waitForElement(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card
    const weatherCard = await waitForElement(driver, '.weather-card', 15000);
    expect(await weatherCard.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'mobile-weather-card');
  }, 30000);

  test('should display weather card responsively on tablet', async () => {
    await driver.get(BASE_URL);
    
    // Set tablet viewport
    await driver.manage().window().setRect({ width: 768, height: 1024 });
    
    // Search for a city
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('Paris');
    
    const searchButton = await waitForElement(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card
    const weatherCard = await waitForElement(driver, '.weather-card', 15000);
    expect(await weatherCard.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'tablet-weather-card');
  }, 30000);

  test('should display weather card responsively on desktop', async () => {
    await driver.get(BASE_URL);
    
    // Set desktop viewport
    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    
    // Search for a city
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('Tokyo');
    
    const searchButton = await waitForElement(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card
    const weatherCard = await waitForElement(driver, '.weather-card', 15000);
    expect(await weatherCard.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'desktop-weather-card');
  }, 30000);
});
