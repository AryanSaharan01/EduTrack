/**
 * NeonDB Migration Script - Judge0 Integration
 * 
 * This script automatically runs the Judge0 migration on your NeonDB database.
 * It adds 8 columns to store code execution results.
 * 
 * Usage:
 *   node run-neon-migration.js
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

async function runMigration() {
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, '🚀', 'NeonDB Migration - Judge0 Integration');
  console.log('='.repeat(60) + '\n');

  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    log(colors.red, '❌', 'DATABASE_URL not found in .env file');
    console.log('\nPlease add your NeonDB connection string to .env:');
    console.log('DATABASE_URL=postgresql://user:pass@host/db?sslmode=require\n');
    process.exit(1);
  }

  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    log(colors.blue, '🔗', 'Connecting to NeonDB...');
    const connectionTest = await pool.query('SELECT NOW() as current_time, current_database() as database');
    log(colors.green, '✅', `Connected to database: ${connectionTest.rows[0].database}`);
    log(colors.cyan, '⏰', `Server time: ${connectionTest.rows[0].current_time.toISOString()}`);

    // Check if table exists
    log(colors.blue, '🔍', 'Checking if submission_answers table exists...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'lms' 
        AND table_name = 'submission_answers'
      ) as exists
    `);

    if (!tableCheck.rows[0].exists) {
      log(colors.red, '❌', 'Table lms.submission_answers does not exist!');
      console.log('\nPlease run your main schema creation first:');
      console.log('  node setup-database.js');
      console.log('  OR run backend/database/schema.sql\n');
      process.exit(1);
    }

    log(colors.green, '✅', 'Table lms.submission_answers found');

    // Check if columns already exist
    log(colors.blue, '🔍', 'Checking if migration already ran...');
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'lms' 
        AND table_name = 'submission_answers'
        AND column_name IN (
          'code_output', 'execution_time', 'memory_used', 'execution_status',
          'test_case_passed', 'expected_output', 'actual_output', 'error_message'
        )
    `);

    if (columnCheck.rows.length > 0) {
      log(colors.yellow, '⚠️', `Found ${columnCheck.rows.length} columns already exist`);
      console.log('\nExisting columns:', columnCheck.rows.map(r => r.column_name).join(', '));
      console.log('\nMigration will only add missing columns (safe operation).\n');
    }

    // Read migration file
    log(colors.blue, '📄', 'Reading migration file...');
    const migrationPath = path.join(__dirname, 'database', 'migration_judge0_outputs.sql');
    
    if (!fs.existsSync(migrationPath)) {
      log(colors.red, '❌', 'Migration file not found at: ' + migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    log(colors.green, '✅', 'Migration file loaded');

    // Execute migration
    log(colors.blue, '🚀', 'Running migration...');
    console.log('─'.repeat(60));
    
    await pool.query(migrationSQL);
    
    console.log('─'.repeat(60));
    log(colors.green, '✅', 'Migration executed successfully!');

    // Verify all columns were added
    log(colors.blue, '🔍', 'Verifying migration...');
    const verifyResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'lms' 
        AND table_name = 'submission_answers'
        AND column_name IN (
          'code_output', 'execution_time', 'memory_used', 'execution_status',
          'test_case_passed', 'expected_output', 'actual_output', 'error_message'
        )
      ORDER BY column_name
    `);

    if (verifyResult.rows.length === 8) {
      log(colors.green, '✅', 'All 8 columns verified successfully!\n');
      
      console.log('Columns added:');
      console.log('─'.repeat(60));
      verifyResult.rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ${row.column_name.padEnd(20)} | ${row.data_type.padEnd(15)} | Nullable: ${row.is_nullable}`);
      });
      console.log('─'.repeat(60));
    } else {
      log(colors.yellow, '⚠️', `Warning: Expected 8 columns, found ${verifyResult.rows.length}`);
    }

    // Check indexes
    log(colors.blue, '🔍', 'Checking indexes...');
    const indexResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes
      WHERE schemaname = 'lms'
        AND tablename = 'submission_answers'
        AND (indexname LIKE '%test_passed%' OR indexname LIKE '%execution_status%')
    `);

    if (indexResult.rows.length > 0) {
      log(colors.green, '✅', `${indexResult.rows.length} indexes created for performance optimization`);
      indexResult.rows.forEach(row => {
        console.log(`     - ${row.indexname}`);
      });
    }

    // Show next steps
    console.log('\n' + '='.repeat(60));
    log(colors.green, '🎉', 'Migration Complete!');
    console.log('='.repeat(60));
    console.log('\n📋 Next Steps:');
    console.log('  1. ✅ Restart backend server: npm run dev');
    console.log('  2. ✅ Test student code execution');
    console.log('  3. ✅ Test teacher grading page');
    console.log('  4. ✅ Check NeonDB dashboard for storage usage\n');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log(colors.red, '❌', 'Migration Failed!');
    console.log('='.repeat(60));
    console.error('\nError details:');
    console.error(error.message);
    
    if (error.message.includes('permission denied')) {
      console.log('\n💡 Tip: Make sure your NeonDB user has ALTER TABLE permissions');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Make sure your schema (lms) and table (submission_answers) exist');
    } else if (error.message.includes('SSL')) {
      console.log('\n💡 Tip: Make sure your connection string includes ?sslmode=require');
    }
    
    console.log('\n📚 See NEONDB_MIGRATION_GUIDE.md for detailed troubleshooting\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
runMigration();
