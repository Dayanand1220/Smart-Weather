#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

console.log('🧪 Complete End-to-End Test Suite\n');
console.log('=' .repeat(60));

// Check if servers are running
async function checkServer(port, name) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${name} is running on port ${port}`);
        resolve(true);
      } else {
        console.log(`❌ ${name} returned status ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log(`❌ ${name} is NOT running on port ${port}`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log(`❌ ${name} connection timeout on port ${port}`);
      resolve(false);
    });
  });
}

async function checkFrontend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3001', (res) => {
      console.log(`✅ Frontend is running on port 3001`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`❌ Frontend is NOT running on port 3001`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log(`❌ Frontend connection timeout`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('\n📡 Checking if servers are running...\n');
  
  const backendRunning = await checkServer(3000, 'Backend');
  const frontendRunning = await checkFrontend();
  
  console.log('\n' + '='.repeat(60));
  
  if (!backendRunning || !frontendRunning) {
    console.log('\n❌ ERROR: Servers are not running!\n');
    console.log('Please start the servers first:');
    console.log('  npm run dev:all\n');
    console.log('Then run this test again.\n');
    process.exit(1);
  }
  
  console.log('\n✅ All servers are running!\n');
  console.log('🚀 Starting Complete End-to-End Tests...\n');
  console.log('=' .repeat(60) + '\n');
  
  // Run the complete E2E test
  const jest = spawn('npx', [
    'jest',
    'tests/frontend/complete-e2e.test.js',
    '--verbose',
    '--runInBand'
  ], {
    stdio: 'inherit',
    shell: true
  });
  
  jest.on('close', (code) => {
    console.log('\n' + '='.repeat(60));
    if (code === 0) {
      console.log('\n✅ ALL TESTS PASSED!\n');
      console.log('📸 Screenshots saved in: tests/frontend/screenshots/\n');
      console.log('Test Coverage:');
      console.log('  ✅ Authentication (Login, Register, Logout)');
      console.log('  ✅ Weather Search');
      console.log('  ✅ Favorites');
      console.log('  ✅ Theme Toggle');
      console.log('  ✅ User Profile');
      console.log('  ✅ Responsive Design');
      console.log('  ✅ Error Handling\n');
    } else {
      console.log('\n❌ SOME TESTS FAILED\n');
      console.log('Check the output above for details.');
      console.log('Screenshots saved in: tests/frontend/screenshots/\n');
    }
    process.exit(code);
  });
}

main();
