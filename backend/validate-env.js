#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Run this before deployment to ensure all required variables are set
 */

require('dotenv').config();

const requiredVars = {
  // Server Config
  NODE_ENV: 'production',
  PORT: '5000',
  FRONTEND_URL: 'https://edutrackpro.vercel.app',
  
  // Database
  DATABASE_URL: 'postgresql://neondb_owner:npg_jx5TZ0AlbvQh@ep-jolly-resonance-adcqofbn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  DB_SCHEMA: 'lms',
  
  // JWT
  JWT_SECRET: 'fd8999f6ba681d12738678c1df5dc6e82224c71791d7c97fe1df1d20125f7292d265ea14cc34bebbc5eee2a86ab8ecc3b22276ba832fb8bccd932bc47461e7a1',
  JWT_EXPIRES_IN: '24h',
  
  // SMTP
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: '587',
  SMTP_SECURE: 'false',
  SMTP_USER: 'hackathon01program01@gmail.com',
  SMTP_PASS: 'your-app-password',
  
  // Judge0
  JUDGE0_API_URL: 'https://judge0-ce.p.rapidapi.com',
  JUDGE0_API_KEY: 'ephj fkze ythh eckd'
};

console.log('\n🔍 Validating Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

Object.keys(requiredVars).forEach(key => {
  const value = process.env[key];
  const example = requiredVars[key];
  
  if (!value) {
    console.error(`❌ MISSING: ${key} (example: ${example})`);
    hasErrors = true;
  } else if (value === example) {
    console.warn(`⚠️  WARNING: ${key} appears to be using example value`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${key}: Set`);
  }
});

// Additional validations
console.log('\n🔍 Running Additional Validations...\n');

// Check DATABASE_URL format
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('?sslmode=require')) {
  console.warn('⚠️  WARNING: DATABASE_URL should include "?sslmode=require" for NeonDB');
  hasWarnings = true;
}

// Check SMTP_PORT
if (process.env.SMTP_PORT && process.env.SMTP_PORT !== '587') {
  console.warn(`⚠️  WARNING: SMTP_PORT is ${process.env.SMTP_PORT}, recommended is 587 for TLS`);
  hasWarnings = true;
}

// Check SMTP_SECURE
if (process.env.SMTP_SECURE && process.env.SMTP_SECURE !== 'false') {
  console.warn('⚠️  WARNING: SMTP_SECURE should be "false" when using port 587');
  hasWarnings = true;
}

// Check JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long');
  hasWarnings = true;
}

// Check FRONTEND_URL format
if (process.env.FRONTEND_URL && process.env.FRONTEND_URL.endsWith('/')) {
  console.warn('⚠️  WARNING: FRONTEND_URL should not end with a trailing slash');
  hasWarnings = true;
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.error('\n❌ VALIDATION FAILED: Missing required environment variables');
  console.error('Please set all required variables before deployment.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.warn('Review warnings above and fix if needed.\n');
  process.exit(0);
} else {
  console.log('\n✅ VALIDATION PASSED: All environment variables are set correctly!\n');
  process.exit(0);
}
