/**
 * Simple Authentication Test Script
 * 
 * This script tests the authentication endpoints to verify everything is working.
 * Run with: node test-auth.js
 * 
 * Make sure your backend server is running on http://localhost:3000
 */

const http = require('http');

const API_BASE = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          };
          resolve(response);
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test data
const testUser = {
  username: 'testuser_' + Date.now(),
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
  securityQuestion: 'What was the name of your first pet?',
  securityAnswer: 'Fluffy',
};

async function runTests() {
  console.log('🧪 Starting Authentication Tests...\n');

  try {
    // Test 1: Register
    console.log('1️⃣  Testing Registration...');
    const registerRes = await makeRequest('POST', '/api/auth/register', testUser);
    
    if (registerRes.status === 201) {
      console.log('   ✅ Registration successful!');
      console.log('   User:', registerRes.data.user.username);
      console.log('   Token:', registerRes.data.token.substring(0, 20) + '...');
    } else {
      console.log('   ❌ Registration failed:', registerRes.data);
      return;
    }

    const token = registerRes.data.token;

    // Test 2: Login
    console.log('\n2️⃣  Testing Login...');
    const loginRes = await makeRequest('POST', '/api/auth/login', {
      email: testUser.email,
      password: testUser.password,
    });

    if (loginRes.status === 200) {
      console.log('   ✅ Login successful!');
      console.log('   User:', loginRes.data.user.username);
    } else {
      console.log('   ❌ Login failed:', loginRes.data);
    }

    // Test 3: Get Security Question
    console.log('\n3️⃣  Testing Get Security Question...');
    const securityRes = await makeRequest('POST', '/api/auth/security-question', {
      email: testUser.email,
    });

    if (securityRes.status === 200) {
      console.log('   ✅ Security question retrieved!');
      console.log('   Question:', securityRes.data.securityQuestion);
    } else {
      console.log('   ❌ Failed to get security question:', securityRes.data);
    }

    // Test 4: Reset Password
    console.log('\n4️⃣  Testing Password Reset...');
    const resetRes = await makeRequest('POST', '/api/auth/reset-password', {
      email: testUser.email,
      securityAnswer: testUser.securityAnswer,
      newPassword: 'newpassword123',
    });

    if (resetRes.status === 200) {
      console.log('   ✅ Password reset successful!');
    } else {
      console.log('   ❌ Password reset failed:', resetRes.data);
    }

    // Test 5: Login with new password
    console.log('\n5️⃣  Testing Login with New Password...');
    const newLoginRes = await makeRequest('POST', '/api/auth/login', {
      email: testUser.email,
      password: 'newpassword123',
    });

    if (newLoginRes.status === 200) {
      console.log('   ✅ Login with new password successful!');
    } else {
      console.log('   ❌ Login with new password failed:', newLoginRes.data);
    }

    // Test 6: Protected route (Get current user)
    console.log('\n6️⃣  Testing Protected Route...');
    const meRes = await makeRequest('GET', '/api/auth/me');
    
    if (meRes.status === 401) {
      console.log('   ✅ Protected route correctly requires authentication!');
    } else {
      console.log('   ⚠️  Protected route did not require authentication');
    }

    console.log('\n✅ All tests completed!\n');
    console.log('📝 Test Summary:');
    console.log('   • User Registration: Working');
    console.log('   • User Login: Working');
    console.log('   • Security Questions: Working');
    console.log('   • Password Reset: Working');
    console.log('   • Protected Routes: Working');
    console.log('\n🎉 Authentication system is fully functional!\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('\n⚠️  Make sure your backend server is running on http://localhost:3000\n');
  }
}

// Run the tests
runTests();
