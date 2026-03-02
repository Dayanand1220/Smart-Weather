#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Starting Selenium Frontend Tests...\n');
console.log('⚠️  Make sure the following are running:');
console.log('   - Backend server on http://localhost:3000');
console.log('   - Frontend server on http://localhost:3001');
console.log('   - Chrome browser is installed\n');

// Run Jest with Selenium tests
const jest = spawn('npx', ['jest', '--testMatch=**/tests/frontend/**/*.test.js', '--verbose'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, '../..')
});

jest.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ All tests passed!');
    console.log('📸 Screenshots saved in tests/frontend/screenshots/');
  } else {
    console.log('\n❌ Some tests failed');
  }
  process.exit(code);
});
