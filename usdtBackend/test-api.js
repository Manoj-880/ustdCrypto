const axios = require('axios');

const BASE_URL = 'http://localhost:5002';

async function testAPI() {
    console.log('🧪 Testing API endpoints...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/api/health`);
        console.log('✅ Health check:', healthResponse.data);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
    }

    try {
        // Test basic endpoint
        console.log('\n2. Testing basic endpoint...');
        const testResponse = await axios.get(`${BASE_URL}/test`);
        console.log('✅ Test endpoint:', testResponse.data);
    } catch (error) {
        console.log('❌ Test endpoint failed:', error.message);
    }

    try {
        // Test user registration
        console.log('\n3. Testing user registration...');
        const userData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            mobile: '1234567890',
            walletId: 'test-wallet-123',
            password: 'testpassword123'
        };
        
        const registerResponse = await axios.post(`${BASE_URL}/api/users`, userData);
        console.log('✅ User registration:', registerResponse.data);
    } catch (error) {
        console.log('❌ User registration failed:', error.response?.data || error.message);
    }

    try {
        // Test user login
        console.log('\n4. Testing user login...');
        const loginData = {
            email: 'test@example.com',
            password: 'testpassword123'
        };
        
        const loginResponse = await axios.post(`${BASE_URL}/api/login`, loginData);
        console.log('✅ User login:', loginResponse.data);
    } catch (error) {
        console.log('❌ User login failed:', error.response?.data || error.message);
    }

    console.log('\n🏁 API testing completed!');
}

// Run the test
testAPI();
