# Frontend Selenium Tests

Comprehensive automated tests for the Smart Weather App frontend using Selenium WebDriver.

## 📋 Test Coverage

### 1. Search Functionality Tests (`search.test.js`)
- ✅ Homepage loads successfully
- ✅ Search bar displays with correct placeholder
- ✅ Search for city and display weather data
- ✅ Loading state during search
- ✅ Error handling for invalid cities
- ✅ Multiple sequential searches

### 2. Theme Toggle Tests (`theme.test.js`)
- ✅ Toggle between light and dark themes
- ✅ Theme persistence after page reload
- ✅ Theme button text updates
- ✅ Theme applies to all components

### 3. Favorites Tests (`favorites.test.js`)
- ✅ Add city to favorites
- ✅ Display favorites section
- ✅ Click favorite to search
- ✅ Remove city from favorites

### 4. Responsive Design Tests (`responsive.test.js`)
- ✅ Mobile viewport (375px)
- ✅ Tablet viewport (768px)
- ✅ Desktop viewport (1920px)
- ✅ Weather card on different screen sizes

## 🚀 Prerequisites

### 1. Install Chrome Browser
Make sure Google Chrome is installed on your system.

### 2. Install ChromeDriver
ChromeDriver will be installed automatically with selenium-webdriver.

### 3. Servers Must Be Running
Before running tests, ensure both servers are running:

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## 📦 Installation

Install test dependencies:
```bash
npm install
```

## 🧪 Running Tests

### Run All Frontend Tests
```bash
npm run test:frontend
```

### Run Specific Test File
```bash
npx jest tests/frontend/search.test.js
```

### Run Tests in Watch Mode
```bash
npx jest tests/frontend --watch
```

### Run Tests with Verbose Output
```bash
npx jest tests/frontend --verbose
```

## 📸 Screenshots

Tests automatically capture screenshots at key points:
- Location: `tests/frontend/screenshots/`
- Screenshots are saved with descriptive names
- Useful for debugging and visual verification

## 🔧 Configuration

### Headless Mode
To run tests in headless mode (no browser window), edit `setup.js`:

```javascript
const options = new chrome.Options();
options.addArguments('--headless'); // Uncomment this line
```

### Timeout Settings
Default timeout is 10 seconds. To change:

```javascript
const TIMEOUT = 15000; // 15 seconds
```

### Base URL
Tests run against `http://localhost:3001` by default. To change:

```javascript
const BASE_URL = 'http://your-url:port';
```

## 📊 Test Results

### Successful Test Output
```
PASS  tests/frontend/search.test.js
  Weather Search Functionality
    ✓ should load the homepage successfully (2345ms)
    ✓ should display search bar with placeholder (1234ms)
    ✓ should search for a city and display weather data (5678ms)
    ...

Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Screenshots: 25 saved
```

### Failed Test Output
```
FAIL  tests/frontend/search.test.js
  Weather Search Functionality
    ✕ should search for a city and display weather data (5000ms)
    
    Element .weather-card not found within 15000ms
```

## 🐛 Troubleshooting

### Issue: "ChromeDriver not found"
**Solution:**
```bash
npm install selenium-webdriver --save-dev
```

### Issue: "Connection refused to localhost:3001"
**Solution:** Make sure frontend server is running:
```bash
cd frontend && npm start
```

### Issue: "Element not found"
**Solution:** 
- Increase timeout in `setup.js`
- Check if element selector is correct
- Verify page is fully loaded

### Issue: "Tests are slow"
**Solution:**
- Run in headless mode
- Reduce wait times
- Run tests in parallel (advanced)

## 📝 Writing New Tests

### Basic Test Structure
```javascript
const { createDriver, waitForElement, BASE_URL } = require('./setup');

describe('My Test Suite', () => {
  let driver;

  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('should do something', async () => {
    await driver.get(BASE_URL);
    
    const element = await waitForElement(driver, '.my-selector');
    expect(await element.isDisplayed()).toBe(true);
  }, 30000);
});
```

### Helper Functions
- `createDriver()` - Create new WebDriver instance
- `waitForElement(driver, selector)` - Wait for element to appear
- `waitForClickable(driver, selector)` - Wait for element to be clickable
- `takeScreenshot(driver, filename)` - Capture screenshot

## 🎯 Best Practices

1. **Always clean up** - Use `afterAll` to quit driver
2. **Use explicit waits** - Don't use `sleep()` unless necessary
3. **Take screenshots** - Capture evidence of test execution
4. **Descriptive test names** - Make it clear what's being tested
5. **Increase timeouts** - Network requests can be slow
6. **Test isolation** - Each test should be independent

## 📚 Resources

- [Selenium WebDriver Docs](https://www.selenium.dev/documentation/webdriver/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)

## 🤝 Contributing

To add new tests:
1. Create a new test file in `tests/frontend/`
2. Follow the existing test structure
3. Add descriptive test cases
4. Update this README with new test coverage

---

**Happy Testing! 🧪**
