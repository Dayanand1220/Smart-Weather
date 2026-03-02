const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Configuration
const BASE_URL = 'http://localhost:3001';
const TIMEOUT = 10000;

/**
 * Create a new WebDriver instance
 */
async function createDriver() {
  const options = new chrome.Options();
  // Uncomment for headless mode
  // options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: TIMEOUT });
  return driver;
}

/**
 * Wait for element to be visible
 */
async function waitForElement(driver, selector, timeout = TIMEOUT) {
  return await driver.wait(
    until.elementLocated(By.css(selector)),
    timeout,
    `Element ${selector} not found within ${timeout}ms`
  );
}

/**
 * Wait for element to be clickable
 */
async function waitForClickable(driver, selector, timeout = TIMEOUT) {
  const element = await waitForElement(driver, selector, timeout);
  await driver.wait(
    until.elementIsVisible(element),
    timeout,
    `Element ${selector} not visible within ${timeout}ms`
  );
  return element;
}

/**
 * Take a screenshot
 */
async function takeScreenshot(driver, filename) {
  const screenshot = await driver.takeScreenshot();
  const fs = require('fs');
  const path = require('path');
  
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }
  
  const filepath = path.join(screenshotDir, `${filename}.png`);
  fs.writeFileSync(filepath, screenshot, 'base64');
  console.log(`Screenshot saved: ${filepath}`);
}

/**
 * Login helper for authenticated tests
 */
async function loginUser(driver, email = 'test@example.com', password = 'password123') {
  try {
    // Go to login page
    await driver.get(`${BASE_URL}/login`);
    await driver.sleep(1000);
    
    // Fill in login form
    const emailInput = await waitForElement(driver, 'input[type="email"]');
    await emailInput.clear();
    await emailInput.sendKeys(email);
    
    const passwordInput = await waitForElement(driver, 'input[type="password"]');
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
    
    // Submit form
    const loginButton = await waitForClickable(driver, 'button[type="submit"]');
    await loginButton.click();
    
    // Wait for redirect to main app
    await driver.sleep(2000);
    
    return true;
  } catch (error) {
    console.log('Login failed:', error.message);
    return false;
  }
}

/**
 * Register a new user
 */
async function registerUser(driver, username, email, password, securityQuestion, securityAnswer) {
  try {
    // Go to register page
    await driver.get(`${BASE_URL}/register`);
    await driver.sleep(1000);
    
    // Fill in registration form
    const usernameInput = await waitForElement(driver, 'input[name="username"]');
    await usernameInput.sendKeys(username);
    
    const emailInput = await waitForElement(driver, 'input[name="email"]');
    await emailInput.sendKeys(email);
    
    const passwordInput = await waitForElement(driver, 'input[name="password"]');
    await passwordInput.sendKeys(password);
    
    const confirmPasswordInput = await waitForElement(driver, 'input[name="confirmPassword"]');
    await confirmPasswordInput.sendKeys(password);
    
    const questionSelect = await waitForElement(driver, 'select[name="securityQuestion"]');
    await questionSelect.sendKeys(securityQuestion);
    
    const answerInput = await waitForElement(driver, 'input[name="securityAnswer"]');
    await answerInput.sendKeys(securityAnswer);
    
    // Submit form
    const registerButton = await waitForClickable(driver, 'button[type="submit"]');
    await registerButton.click();
    
    // Wait for redirect
    await driver.sleep(2000);
    
    return true;
  } catch (error) {
    console.log('Registration failed:', error.message);
    return false;
  }
}

/**
 * Logout user
 */
async function logoutUser(driver) {
  try {
    // Click user dropdown
    const userDropdown = await waitForClickable(driver, '.dropdown-toggle');
    await userDropdown.click();
    await driver.sleep(500);
    
    // Click logout
    const logoutButton = await waitForClickable(driver, '.dropdown-menu .dropdown-item');
    await logoutButton.click();
    await driver.sleep(1000);
    
    return true;
  } catch (error) {
    console.log('Logout failed:', error.message);
    return false;
  }
}

module.exports = {
  createDriver,
  waitForElement,
  waitForClickable,
  takeScreenshot,
  loginUser,
  registerUser,
  logoutUser,
  BASE_URL,
  TIMEOUT,
  By,
  until
};
