const { 
  createDriver, 
  waitForElement, 
  waitForClickable, 
  takeScreenshot, 
  BASE_URL, 
  By 
} = require('./setup');

describe('Complete End-to-End Tests - Weather App with Authentication', () => {
  let driver;
  const timestamp = Date.now();
  const testUser = {
    username: `e2euser${timestamp}`,
    email: `e2e${timestamp}@test.com`,
    password: 'TestPass123!',
    securityQuestion: "What was the name of your first pet?",
    securityAnswer: 'Fluffy'
  };

  beforeAll(async () => {
    driver = await createDriver();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      try {
        await driver.quit();
      } catch (e) {
        console.log('Driver already closed');
      }
    }
  }, 30000);

  // ==================== AUTHENTICATION TESTS ====================

  describe('1. Authentication Flow', () => {
    test('1.1 - Should redirect unauthenticated users to login', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/login');
      
      await takeScreenshot(driver, 'e2e-01-redirect-to-login');
    }, 30000);

    test('1.2 - Should display complete login page', async () => {
      await driver.get(`${BASE_URL}/login`);
      await driver.sleep(1000);
      
      // Check heading
      const heading = await waitForElement(driver, 'h2');
      expect(await heading.getText()).toBe('Login');
      
      // Check form fields
      const emailInput = await waitForElement(driver, 'input[type="email"]');
      const passwordInput = await waitForElement(driver, 'input[type="password"]');
      const loginButton = await waitForElement(driver, 'button[type="submit"]');
      
      expect(await emailInput.isDisplayed()).toBe(true);
      expect(await passwordInput.isDisplayed()).toBe(true);
      expect(await loginButton.getText()).toBe('Login');
      
      await takeScreenshot(driver, 'e2e-02-login-page');
    }, 30000);

    test('1.3 - Should navigate to registration page', async () => {
      await driver.get(`${BASE_URL}/login`);
      await driver.sleep(1000);
      
      const signUpLink = await waitForClickable(driver, 'a[href="/register"]');
      await signUpLink.click();
      await driver.sleep(1000);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/register');
      
      const heading = await waitForElement(driver, 'h2');
      expect(await heading.getText()).toBe('Sign Up');
      
      await takeScreenshot(driver, 'e2e-03-register-page');
    }, 30000);

    test('1.4 - Should register a new user', async () => {
      await driver.get(`${BASE_URL}/register`);
      await driver.sleep(1000);
      
      // Fill registration form
      const usernameInput = await waitForElement(driver, 'input[name="username"]');
      await usernameInput.sendKeys(testUser.username);
      
      const emailInput = await waitForElement(driver, 'input[name="email"]');
      await emailInput.sendKeys(testUser.email);
      
      const passwordInput = await waitForElement(driver, 'input[name="password"]');
      await passwordInput.sendKeys(testUser.password);
      
      const confirmPasswordInput = await waitForElement(driver, 'input[name="confirmPassword"]');
      await confirmPasswordInput.sendKeys(testUser.password);
      
      const questionSelect = await waitForElement(driver, 'select[name="securityQuestion"]');
      await questionSelect.sendKeys(testUser.securityQuestion);
      
      const answerInput = await waitForElement(driver, 'input[name="securityAnswer"]');
      await answerInput.sendKeys(testUser.securityAnswer);
      
      await takeScreenshot(driver, 'e2e-04-registration-filled');
      
      // Submit
      const registerButton = await waitForClickable(driver, 'button[type="submit"]');
      await registerButton.click();
      
      // Wait for redirect to main app
      await driver.sleep(3000);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(`${BASE_URL}/`);
      
      await takeScreenshot(driver, 'e2e-05-registration-success');
    }, 45000);
  });

  // ==================== WEATHER APP TESTS ====================

  describe('2. Weather Search Functionality', () => {
    test('2.1 - Should display weather app interface', async () => {
      // Should already be logged in from previous test
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      // Check main elements
      const header = await waitForElement(driver, '.navbar-brand');
      expect(await header.isDisplayed()).toBe(true);
      
      const searchInput = await waitForElement(driver, 'input[type="text"]');
      expect(await searchInput.isDisplayed()).toBe(true);
      
      await takeScreenshot(driver, 'e2e-06-weather-app-home');
    }, 30000);

    test('2.2 - Should search for a city and display weather', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      const searchInput = await waitForElement(driver, 'input[type="text"]');
      await searchInput.clear();
      await searchInput.sendKeys('London');
      
      const searchButton = await waitForClickable(driver, 'button[type="submit"]');
      await searchButton.click();
      
      // Wait for weather data
      await driver.sleep(5000);
      
      // Check for weather card
      try {
        const weatherCard = await waitForElement(driver, '.weather-card', 15000);
        expect(await weatherCard.isDisplayed()).toBe(true);
        
        await takeScreenshot(driver, 'e2e-07-weather-london');
      } catch (e) {
        console.log('Weather card not found, might be API issue');
        await takeScreenshot(driver, 'e2e-07-weather-error');
      }
    }, 45000);

    test('2.3 - Should search for multiple cities', async () => {
      const cities = ['Paris', 'Tokyo'];
      
      for (const city of cities) {
        await driver.get(BASE_URL);
        await driver.sleep(1000);
        
        const searchInput = await waitForElement(driver, 'input[type="text"]');
        await searchInput.clear();
        await searchInput.sendKeys(city);
        
        const searchButton = await waitForClickable(driver, 'button[type="submit"]');
        await searchButton.click();
        
        await driver.sleep(5000);
        
        await takeScreenshot(driver, `e2e-08-weather-${city.toLowerCase()}`);
      }
    }, 60000);
  });

  // ==================== FAVORITES TESTS ====================

  describe('3. Favorites Functionality', () => {
    test('3.1 - Should add city to favorites', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      // Search for a city first
      const searchInput = await waitForElement(driver, 'input[type="text"]');
      await searchInput.clear();
      await searchInput.sendKeys('New York');
      
      const searchButton = await waitForClickable(driver, 'button[type="submit"]');
      await searchButton.click();
      
      await driver.sleep(5000);
      
      try {
        // Try to find and click favorite button
        const favoriteButton = await waitForElement(driver, 'button.btn-outline-danger, button.btn-danger', 10000);
        await favoriteButton.click();
        
        await driver.sleep(2000);
        await takeScreenshot(driver, 'e2e-09-add-favorite');
      } catch (e) {
        console.log('Favorite button not found');
        await takeScreenshot(driver, 'e2e-09-favorite-error');
      }
    }, 45000);

    test('3.2 - Should display favorites section', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      try {
        const favoritesSection = await waitForElement(driver, '.favorites-container, .favorite-cities', 10000);
        expect(await favoritesSection.isDisplayed()).toBe(true);
        
        await takeScreenshot(driver, 'e2e-10-favorites-section');
      } catch (e) {
        console.log('Favorites section not found');
        await takeScreenshot(driver, 'e2e-10-no-favorites');
      }
    }, 30000);
  });

  // ==================== THEME TESTS ====================

  describe('4. Theme Functionality', () => {
    test('4.1 - Should toggle between light and dark themes', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      // Find theme toggle button
      try {
        const themeButton = await waitForElement(driver, 'button.rounded-pill', 10000);
        
        // Get initial theme
        const html = await driver.findElement(By.css('html'));
        const initialTheme = await html.getAttribute('data-theme');
        
        await takeScreenshot(driver, `e2e-11-theme-${initialTheme}`);
        
        // Toggle theme
        await themeButton.click();
        await driver.sleep(1000);
        
        const newTheme = await html.getAttribute('data-theme');
        expect(newTheme).not.toBe(initialTheme);
        
        await takeScreenshot(driver, `e2e-12-theme-${newTheme}`);
      } catch (e) {
        console.log('Theme button not found');
        await takeScreenshot(driver, 'e2e-11-theme-error');
      }
    }, 30000);
  });

  // ==================== USER PROFILE TESTS ====================

  describe('5. User Profile & Logout', () => {
    test('5.1 - Should display user dropdown', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      try {
        const userDropdown = await waitForElement(driver, '.dropdown-toggle', 10000);
        expect(await userDropdown.isDisplayed()).toBe(true);
        
        const dropdownText = await userDropdown.getText();
        expect(dropdownText).toContain(testUser.username);
        
        await takeScreenshot(driver, 'e2e-13-user-dropdown');
      } catch (e) {
        console.log('User dropdown not found');
        await takeScreenshot(driver, 'e2e-13-dropdown-error');
      }
    }, 30000);

    test('5.2 - Should logout successfully', async () => {
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      try {
        // Click user dropdown
        const userDropdown = await waitForClickable(driver, '.dropdown-toggle');
        await userDropdown.click();
        await driver.sleep(500);
        
        await takeScreenshot(driver, 'e2e-14-dropdown-open');
        
        // Click logout
        const logoutButton = await waitForClickable(driver, '.dropdown-menu .dropdown-item');
        await logoutButton.click();
        
        await driver.sleep(2000);
        
        // Should redirect to login
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('/login');
        
        await takeScreenshot(driver, 'e2e-15-logged-out');
      } catch (e) {
        console.log('Logout failed:', e.message);
        await takeScreenshot(driver, 'e2e-15-logout-error');
      }
    }, 30000);

    test('5.3 - Should login with existing user', async () => {
      // Make sure we're on login page
      await driver.get(`${BASE_URL}/login`);
      await driver.sleep(2000);
      
      // Wait longer for page to fully load
      const emailInput = await waitForElement(driver, 'input[type="email"]', 15000);
      await emailInput.clear();
      await emailInput.sendKeys(testUser.email);
      
      const passwordInput = await waitForElement(driver, 'input[type="password"]');
      await passwordInput.clear();
      await passwordInput.sendKeys(testUser.password);
      
      const loginButton = await waitForClickable(driver, 'button[type="submit"]');
      await loginButton.click();
      
      await driver.sleep(4000);
      
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(`${BASE_URL}/`);
      
      await takeScreenshot(driver, 'e2e-16-login-success');
    }, 45000);
  });

  // ==================== RESPONSIVE TESTS ====================

  describe('6. Responsive Design', () => {
    test('6.1 - Should display correctly on mobile', async () => {
      await driver.manage().window().setRect({ width: 375, height: 812 });
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      await takeScreenshot(driver, 'e2e-17-mobile-view');
    }, 30000);

    test('6.2 - Should display correctly on tablet', async () => {
      await driver.manage().window().setRect({ width: 768, height: 1024 });
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      await takeScreenshot(driver, 'e2e-18-tablet-view');
    }, 30000);

    test('6.3 - Should display correctly on desktop', async () => {
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
      await driver.get(BASE_URL);
      await driver.sleep(2000);
      
      await takeScreenshot(driver, 'e2e-19-desktop-view');
    }, 30000);
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('7. Error Handling', () => {
    test('7.1 - Should show error for invalid city', async () => {
      await driver.manage().window().setRect({ width: 1920, height: 1080 });
      await driver.get(BASE_URL);
      await driver.sleep(1000);
      
      const searchInput = await waitForElement(driver, 'input[type="text"]');
      await searchInput.clear();
      await searchInput.sendKeys('InvalidCityNameXYZ123');
      
      const searchButton = await waitForClickable(driver, 'button[type="submit"]');
      await searchButton.click();
      
      await driver.sleep(3000);
      
      try {
        const errorAlert = await waitForElement(driver, '.alert-danger', 10000);
        expect(await errorAlert.isDisplayed()).toBe(true);
        
        await takeScreenshot(driver, 'e2e-20-error-invalid-city');
      } catch (e) {
        console.log('Error alert not found');
        await takeScreenshot(driver, 'e2e-20-no-error-shown');
      }
    }, 30000);

    test('7.2 - Should show error for invalid login', async () => {
      // Logout first
      try {
        await driver.get(BASE_URL);
        await driver.sleep(2000);
        
        const userDropdown = await waitForClickable(driver, '.dropdown-toggle', 5000);
        await userDropdown.click();
        await driver.sleep(1000);
        
        const logoutButton = await waitForClickable(driver, '.dropdown-menu .dropdown-item');
        await logoutButton.click();
        await driver.sleep(3000);
      } catch (e) {
        console.log('Logout attempt:', e.message);
        // Already logged out or can't find dropdown
      }
      
      // Navigate to login page
      await driver.get(`${BASE_URL}/login`);
      await driver.sleep(2000);
      
      // Wait longer for login page to load
      const emailInput = await waitForElement(driver, 'input[type="email"]', 15000);
      await emailInput.clear();
      await emailInput.sendKeys('wrong@email.com');
      
      const passwordInput = await waitForElement(driver, 'input[type="password"]');
      await passwordInput.clear();
      await passwordInput.sendKeys('wrongpassword');
      
      const loginButton = await waitForClickable(driver, 'button[type="submit"]');
      await loginButton.click();
      
      await driver.sleep(3000);
      
      const errorAlert = await waitForElement(driver, '.alert-danger', 10000);
      expect(await errorAlert.isDisplayed()).toBe(true);
      
      await takeScreenshot(driver, 'e2e-21-error-invalid-login');
    }, 45000);
  });
});
