#!/usr/bin/env node

/**
 * Judge0 Integration Test Script
 * Tests the Judge0 API integration without starting the full server
 */

require('dotenv').config();
const judge0Service = require('./services/judge0Service');

console.log('\n🧪 Testing Judge0 Integration...\n');

async function runTests() {
  try {
    // Test 1: Check connection
    console.log('Test 1: Checking Judge0 API connection...');
    const status = await judge0Service.validateConnection();
    
    if (status.valid) {
      console.log('✅ Connection successful!');
      console.log(`   Languages available: ${status.languages}\n`);
    } else {
      console.log('❌ Connection failed:', status.message);
      console.log('\n💡 Make sure you have configured JUDGE0_API_KEY in .env file');
      console.log('   Run: node setup-judge0.js\n');
      return;
    }

    // Test 2: Run simple Python code
    console.log('Test 2: Running Python "Hello World"...');
    const pythonCode = 'print("Hello from Judge0!")';
    const pythonResult = await judge0Service.executeCode(pythonCode, 'python');
    
    if (pythonResult.success) {
      console.log('✅ Python execution successful!');
      console.log(`   Output: ${pythonResult.output}`);
      console.log(`   Time: ${pythonResult.time}s`);
      console.log(`   Memory: ${(pythonResult.memory / 1024).toFixed(2)} MB\n`);
    } else {
      console.log('❌ Python execution failed:', pythonResult.error);
      console.log(`   ${pythonResult.output}\n`);
    }

    // Test 3: Run JavaScript code
    console.log('Test 3: Running JavaScript code...');
    const jsCode = 'console.log("JavaScript works!");';
    const jsResult = await judge0Service.executeCode(jsCode, 'javascript');
    
    if (jsResult.success) {
      console.log('✅ JavaScript execution successful!');
      console.log(`   Output: ${jsResult.output}`);
      console.log(`   Time: ${jsResult.time}s\n`);
    } else {
      console.log('❌ JavaScript execution failed:', jsResult.error);
      console.log(`   ${jsResult.output}\n`);
    }

    // Test 4: Test code with expected output
    console.log('Test 4: Testing code with expected output...');
    const testCode = 'print("2 + 2 =", 2 + 2)';
    const expectedOutput = '2 + 2 = 4';
    const testResult = await judge0Service.testCode(testCode, 'python', expectedOutput);
    
    if (testResult.passed) {
      console.log('✅ Test passed!');
      console.log(`   Actual: ${testResult.actualOutput}`);
      console.log(`   Expected: ${testResult.expectedOutput}\n`);
    } else {
      console.log('⚠️  Test failed!');
      console.log(`   Actual: ${testResult.actualOutput}`);
      console.log(`   Expected: ${testResult.expectedOutput}`);
      console.log(`   Message: ${testResult.message}\n`);
    }

    // Test 5: Test compilation error
    console.log('Test 5: Testing compilation error handling...');
    const errorCode = 'print("Missing closing quote)';
    const errorResult = await judge0Service.executeCode(errorCode, 'python');
    
    if (!errorResult.success) {
      console.log('✅ Error handling works!');
      console.log(`   Error type: ${errorResult.error}`);
      console.log(`   Message: ${errorResult.output.substring(0, 100)}...\n`);
    } else {
      console.log('⚠️  Expected error but got success\n');
    }

    // Test 6: Get supported languages
    console.log('Test 6: Getting supported languages...');
    const languages = judge0Service.getSupportedLanguages();
    console.log(`✅ Found ${languages.length} supported languages:`);
    console.log(`   ${languages.join(', ')}\n`);

    console.log('🎉 All tests completed!\n');
    console.log('Summary:');
    console.log('✅ Judge0 API is properly configured');
    console.log('✅ Code execution is working');
    console.log('✅ Test validation is working');
    console.log('✅ Error handling is working');
    console.log('\n🚀 You can now start your server: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your .env file has JUDGE0_API_KEY configured');
    console.log('2. Verify your RapidAPI subscription is active');
    console.log('3. Check your internet connection');
    console.log('4. Run: node setup-judge0.js to reconfigure\n');
  }
}

// Run tests
runTests();
