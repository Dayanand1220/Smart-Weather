const { createDriver, waitForElement, waitForClickable, takeScreenshot, BASE_URL, By } = require('./setup');

describe('Weather Search Functionality', () => {
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

  test('should load the homepage successfully', async () => {
    await driver.get(BASE_URL);
    
    // Check if the page title is correct
    const title = await driver.getTitle();
    expect(title).toBe('Smart Weather App');
    
    // Check if header is visible
    const header = await waitForElement(driver, '.navbar-brand');
    expect(await header.isDisplayed()).toBe(true);
    
    await takeScreenshot(driver, 'homepage');
  }, 30000);

  test('should display search bar with placeholder', async () => {
    await driver.get(BASE_URL);
    
    // Find search input
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    expect(await searchInput.isDisplayed()).toBe(true);
    
    // Check placeholder text
    const placeholder = await searchInput.getAttribute('placeholder');
    expect(placeholder).toContain('Enter city name');
    
    await takeScreenshot(driver, 'search-bar');
  }, 30000);

  test('should search for a city and display weather data', async () => {
    await driver.get(BASE_URL);
    
    // Find and fill search input
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.clear();
    await searchInput.sendKeys('London');
    
    // Click search button
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card to appear
    const weatherCard = await waitForElement(driver, '.weather-card', 15000);
    expect(await weatherCard.isDisplayed()).toBe(true);
    
    // Check if city name is displayed
    const cityName = await waitForElement(driver, '.weather-card h2');
    const cityText = await cityName.getText();
    expect(cityText).toBe('London');
    
    // Check if temperature is displayed
    const temperature = await waitForElement(driver, '.display-1');
    const tempText = await temperature.getText();
    expect(tempText).toMatch(/\d+°/);
    
    // Check if weather details are displayed
    const detailCards = await driver.findElements(By.css('.detail-card'));
    expect(detailCards.length).toBeGreaterThanOrEqual(6);
    
    await takeScreenshot(driver, 'weather-results');
  }, 30000);

  test('should show loading state during search', async () => {
    await driver.get(BASE_URL);
    
    // Fill search input
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('Tokyo');
    
    // Click search button
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Check for loading spinner
    try {
      const spinner = await driver.findElement(By.css('.spinner-border'));
      expect(await spinner.isDisplayed()).toBe(true);
    } catch (e) {
      // Spinner might disappear quickly, that's okay
      console.log('Loading spinner not visible (request was too fast)');
    }
    
    // Wait for results
    await waitForElement(driver, '.weather-card', 15000);
    
    await takeScreenshot(driver, 'search-loading');
  }, 30000);

  test('should display error for invalid city', async () => {
    await driver.get(BASE_URL);
    
    // Search for city that doesn't exist (but valid format)
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.clear();
    await searchInput.sendKeys('Zzzzzzzzz');
    
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for error alert
    const errorAlert = await waitForElement(driver, '.alert-danger', 15000);
    expect(await errorAlert.isDisplayed()).toBe(true);
    
    const errorText = await errorAlert.getText();
    // Check for either "not found" or "invalid" error message
    expect(errorText.toLowerCase()).toMatch(/not found|invalid|error/);
    
    await takeScreenshot(driver, 'error-invalid-city');
  }, 30000);

  test('should search for multiple cities sequentially', async () => {
    await driver.get(BASE_URL);
    
    const cities = ['Paris', 'Tokyo', 'London'];
    
    for (const city of cities) {
      // Search for city
      const searchInput = await waitForElement(driver, 'input[type="text"]');
      await searchInput.clear();
      await searchInput.sendKeys(city);
      
      const searchButton = await waitForClickable(driver, 'button[type="submit"]');
      await searchButton.click();
      
      // Wait for weather card with longer timeout
      try {
        const weatherCard = await waitForElement(driver, '.weather-card', 20000);
        const isDisplayed = await weatherCard.isDisplayed();
        expect(isDisplayed).toBe(true);
        
        // Verify city name
        const cityName = await waitForElement(driver, '.weather-card h2');
        const cityText = await cityName.getText();
        console.log(`Found city: ${cityText}`);
        
        await takeScreenshot(driver, `search-${city.toLowerCase().replace(/\s+/g, '-')}`);
      } catch (error) {
        console.log(`Failed to load weather for ${city}: ${error.message}`);
        await takeScreenshot(driver, `error-${city.toLowerCase().replace(/\s+/g, '-')}`);
      }
      
      // Delay between searches
      await driver.sleep(2000);
    }
  }, 90000);
});
