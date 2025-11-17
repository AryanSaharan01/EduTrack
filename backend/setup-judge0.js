#!/usr/bin/env node

/**
 * Judge0 Setup Helper
 * Quick configuration script for Judge0 API integration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');

console.log('\n🚀 Judge0 API Setup Helper\n');
console.log('This script will help you configure Judge0 API for code execution.\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    // Check if .env exists
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env file\n');
    } else {
      console.log('📝 Creating new .env file\n');
      if (fs.existsSync(path.join(__dirname, '.env.example'))) {
        envContent = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
      }
    }

    console.log('Choose your Judge0 setup option:');
    console.log('1. RapidAPI (Recommended for production)');
    console.log('2. Self-hosted (For development/unlimited usage)');
    console.log('3. Skip for now\n');

    const choice = await question('Enter choice (1-3): ');

    if (choice === '3') {
      console.log('\n⏭️  Skipping Judge0 setup. You can configure it later in .env file.\n');
      rl.close();
      return;
    }

    if (choice === '1') {
      console.log('\n📋 RapidAPI Setup:');
      console.log('1. Visit: https://rapidapi.com/judge0-official/api/judge0-ce');
      console.log('2. Sign up and subscribe to a plan');
      console.log('3. Copy your X-RapidAPI-Key\n');

      const apiKey = await question('Enter your RapidAPI Key: ');
      
      if (!apiKey || apiKey.trim() === '') {
        console.log('\n❌ No API key provided. Setup cancelled.\n');
        rl.close();
        return;
      }

      // Update or add Judge0 config
      envContent = updateEnvVar(envContent, 'JUDGE0_API_KEY', apiKey.trim());
      envContent = updateEnvVar(envContent, 'JUDGE0_API_HOST', 'judge0-ce.p.rapidapi.com');

      console.log('\n✅ RapidAPI configuration added!\n');
    } 
    else if (choice === '2') {
      console.log('\n🐳 Self-hosted Setup:');
      console.log('Make sure Judge0 is running locally with Docker:');
      console.log('  git clone https://github.com/judge0/judge0.git');
      console.log('  cd judge0');
      console.log('  docker-compose up -d\n');

      const proceed = await question('Is Judge0 running locally? (y/n): ');
      
      if (proceed.toLowerCase() !== 'y') {
        console.log('\n⏭️  Setup cancelled. Please start Judge0 first.\n');
        rl.close();
        return;
      }

      const host = await question('Enter Judge0 host (default: localhost:2358): ') || 'localhost:2358';

      // Update or add Judge0 config
      envContent = updateEnvVar(envContent, 'JUDGE0_API_HOST', host);
      envContent = updateEnvVar(envContent, 'JUDGE0_API_KEY', '');

      console.log('\n✅ Self-hosted configuration added!\n');
    }

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('✅ Configuration saved to .env file\n');
    console.log('Next steps:');
    console.log('1. Restart your backend server: npm run dev');
    console.log('2. Test the integration at: GET /api/tasks/judge0-status');
    console.log('3. Students can now run and test their code!\n');
    console.log('📖 For more info, check: JUDGE0_SETUP.md\n');

  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
  } finally {
    rl.close();
  }
}

function updateEnvVar(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const newLine = `${key}=${value}`;

  if (regex.test(content)) {
    return content.replace(regex, newLine);
  } else {
    // Add to end of file
    return content + (content.endsWith('\n') ? '' : '\n') + newLine + '\n';
  }
}

// Run setup
setup();
