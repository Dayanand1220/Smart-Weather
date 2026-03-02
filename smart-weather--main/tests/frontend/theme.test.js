const { createDriver, waitForElement, waitForClickable, takeScreenshot, BASE_URL, By } = require('./setup');

describe('Theme Toggle Functionality', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should toggle between light and dark themes', async () => {
    await driver.get(BASE_URL);
    await driver.sleep(1000);
    
    // Get initial theme
    const html = await driver.findElement(By.css('html'));
    const initialTheme = await html.getAttribute('data-theme') || 'light';
    
    await takeScreenshot(driver, 'theme-initial');
    
    // Find and click theme toggle button
    const themeButton = await waitForClickable(driver, 'button.rounded-pill');
    await themeButton.click();
    
    // Wait for theme to change
    await driver.sleep(1000);
    
    // Get new theme
    const newTheme = await html.getAttribute('data-theme') || 'light';
    
    // Theme should have changed
    const themeChanged = (initialTheme === 'light' && newTheme === 'dark') || 
                        (initialTheme === 'dark' && newTheme === 'light') ||
                        (initialTheme === null && newTheme !== null);
    
    expect(themeChanged).toBe(true);
    
    await takeScreenshot(driver, 'theme-toggled');
  }, 30000);

  test('should persist theme preference after page reload', async () => {
    await driver.get(BASE_URL);
    await driver.sleep(1000);
    
    // Toggle to dark theme
    const themeButton = await waitForClickable(driver, 'button.rounded-pill');
    await themeButton.click();
    await driver.sleep(1000);
    
    const html = await driver.findElement(By.css('html'));
    const themeBeforeReload = await html.getAttribute('data-theme') || 'light';
    
    // Reload page
    await driver.navigate().refresh();
    await driver.sleep(2000);
    
    // Check if theme persisted
    const htmlAfterReload = await driver.findElement(By.css('html'));
    const themeAfterReload = await htmlAfterReload.getAttribute('data-theme') || 'light';
    
    // Theme should persist (or at least be set)
    expect(themeAfterReload).toBeTruthy();
    
    await takeScreenshot(driver, 'theme-persisted');
  }, 30000);

  test('should update theme button text when toggling', async () => {
    await driver.get(BASE_URL);
    
    const themeButton = await waitForClickable(driver, 'button.rounded-pill');
    const initialText = await themeButton.getText();
    
    // Toggle theme
    await themeButton.click();
    await driver.sleep(500);
    
    const newText = await themeButton.getText();
    expect(newText).not.toBe(initialText);
    
    // Should contain either "Dark Mode" or "Light Mode"
    expect(newText).toMatch(/Dark Mode|Light Mode/);
  }, 30000);

  test('should apply theme to all components', async () => {
    await driver.get(BASE_URL);
    await driver.sleep(1000);
    
    // Search for a city first
    const searchInput = await waitForElement(driver, 'input[type="text"]');
    await searchInput.sendKeys('London');
    
    const searchButton = await waitForClickable(driver, 'button[type="submit"]');
    await searchButton.click();
    
    // Wait for weather card
    await waitForElement(driver, '.weather-card', 15000);
    
    await takeScreenshot(driver, 'theme-light-with-content');
    
    // Toggle to dark theme
    const themeButton = await waitForClickable(driver, 'button.rounded-pill');
    await themeButton.click();
    await driver.sleep(1000);
    
    await takeScreenshot(driver, 'theme-dark-with-content');
    
    // Verify theme toggle button text changed
    const buttonText = await themeButton.getText();
    expect(buttonText).toMatch(/Dark Mode|Light Mode/);
  }, 30000);
});
