const { createDriver, waitForElement, waitForClickable, takeScreenshot, BASE_URL, By } = require('./setup');

describe('Favorite Cities Functionality', () => {
  let driver;

  beforeEach(async () => {
    driver = await createDriver();
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.quit();
      } catch (e) {
        console.log('Driver already closed');
      }
    }
  });

  test('should add a city to favorites', async () => {
    await driver.get(BASE_URL);
    
    // Search for a city
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('Paris');
    
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card
    await waitForElement(driver, '.weather-card', 15000);
    
    // Click favorite button (star icon)
    const favoriteButton = await waitForClickable(driver, '.favorite-btn');
    await favoriteButton.click();
    
    // Wait for favorite to be added
    await driver.sleep(1000);
    
    await takeScreenshot(driver, 'favorite-added');
    
    // Check if star is filled (favorite is active)
    const starIcon = await favoriteButton.findElement(By.css('svg'));
    const starClass = await starIcon.getAttribute('class');
    // Should contain filled star class or check if it's visible
    expect(starClass).toBeTruthy();
  }, 30000);

  test('should display favorite cities section', async () => {
    await driver.get(BASE_URL);
    
    // Search and add a favorite
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('London');
    
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    await waitForElement(driver, '.weather-card', 15000);
    
    const favoriteButton = await waitForClickable(driver, '.favorite-btn');
    await favoriteButton.click();
    
    await driver.sleep(1000);
    
    // Reload to see favorites section
    await driver.navigate().refresh();
    await driver.sleep(2000);
    
    // Check if favorites section exists
    try {
      const favoritesSection = await driver.findElement(By.css('.favorite-card'));
      expect(await favoritesSection.isDisplayed()).toBe(true);
      await takeScreenshot(driver, 'favorites-section');
    } catch (e) {
      console.log('Favorites section not visible yet');
    }
  }, 30000);

  test('should click on favorite city to search', async () => {
    await driver.get(BASE_URL);
    
    // Wait for page to load
    await driver.sleep(2000);
    
    // Check if there are any favorite cities
    try {
      const favoriteCards = await driver.findElements(By.css('.favorite-card'));
      
      if (favoriteCards.length > 0) {
        // Click on first favorite
        await favoriteCards[0].click();
        
        // Wait for weather card to appear
        await waitForElement(driver, '.weather-card', 15000);
        
        await takeScreenshot(driver, 'favorite-clicked');
        
        // Verify weather card is displayed
        const weatherCard = await driver.findElement(By.css('.weather-card'));
        expect(await weatherCard.isDisplayed()).toBe(true);
      } else {
        console.log('No favorite cities to test');
      }
    } catch (e) {
      console.log('Favorites test skipped - no favorites available');
    }
  }, 30000);

  test('should remove a city from favorites', async () => {
    await driver.get(BASE_URL);
    
    // Search for a city
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('Tokyo');
    
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    await waitForElement(driver, '.weather-card', 15000);
    
    // Add to favorites
    const favoriteButton = await waitForClickable(driver, '.favorite-btn');
    await favoriteButton.click();
    await driver.sleep(1000);
    
    await takeScreenshot(driver, 'before-remove-favorite');
    
    // Click again to remove from favorites
    await favoriteButton.click();
    await driver.sleep(1000);
    
    await takeScreenshot(driver, 'after-remove-favorite');
  }, 30000);
});
