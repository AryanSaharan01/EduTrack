# NeonDB Migration Guide

## ✅ Changes Made

Your project has been updated to use NeonDB (cloud PostgreSQL) instead of local PostgreSQL.

### Files Modified:
1. **`.env`** - Updated to use `DATABASE_URL` connection string
2. **`config/database.js`** - Updated to use connection string with SSL

## 🔧 Setup Instructions

### Step 1: Get Your NeonDB Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to "Connection Details" or "Dashboard"
4. Copy the **Connection String** (it looks like this):
   ```
   postgresql://username:password@ep-xxxxx-xxxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2: Update Your .env File

Replace the dummy connection string in your `.env` file:

```env
DATABASE_URL=your-actual-neondb-connection-string-here
```

**Example:**
```env
DATABASE_URL=postgresql://myuser:mypassword123@ep-cool-cloud-123456.us-east-2.aws.neon.tech/lms_db?sslmode=require
```

### Step 3: Set Up Your Database Schema

You need to run your database migration scripts on NeonDB:

1. **Connect to NeonDB using psql or Neon SQL Editor**
2. **Run your schema files in this order:**
   - `database/schema.sql` - Creates tables
   - `database/seed_data.sql` - Adds initial data (if needed)

**Using Neon SQL Editor (easiest):**
- Go to your Neon project dashboard
- Click on "SQL Editor"
- Copy and paste the contents of `schema.sql`
- Click "Run"
- Then do the same for `seed_data.sql`

**Using psql command line:**
```bash
psql "your-neondb-connection-string" -f database/schema.sql
psql "your-neondb-connection-string" -f database/seed_data.sql
```

### Step 4: Test Your Connection

Start your server:
```bash
cd backend
npm start
```

You should see:
```
✅ Database connected successfully (NeonDB)
```

## 🔑 Important Notes

1. **SSL is Required**: NeonDB requires SSL connections. This is already configured in `config/database.js`.

2. **Connection String Format**: Make sure your connection string ends with `?sslmode=require`

3. **Schema**: Your database schema is still set to `lms`. Make sure all your queries use the correct schema prefix or set the search path.

4. **Pooling**: Connection pooling is set to 20 concurrent connections (configurable in `.env` via `DB_POOL_SIZE`)

5. **Timeout**: Cloud database timeout is increased to 10 seconds (was 2 seconds for local)

## 🐛 Troubleshooting

### Error: "Connection failed"
- Check your `DATABASE_URL` is correct
- Make sure it includes `?sslmode=require`
- Verify your NeonDB project is active (free tier projects may be suspended after inactivity)

### Error: "Schema not found"
- Run your `schema.sql` file on NeonDB
- Make sure queries include schema prefix: `lms.table_name`

### Error: "SSL required"
- Ensure your connection string ends with `?sslmode=require`
- The `ssl: { rejectUnauthorized: false }` option is already set

## 📝 Environment Variables

Your `.env` should now have:

```env
# Database Configuration (NeonDB)
DATABASE_URL=postgresql://username:password@ep-example.region.aws.neon.tech/lms_db?sslmode=require
DB_SCHEMA=lms
DB_POOL_SIZE=20
```

## 🔄 Reverting to Local Database (If Needed)

If you need to switch back to local PostgreSQL:

1. Uncomment the legacy config in `.env`
2. Revert `config/database.js` to use individual connection parameters
3. Comment out `DATABASE_URL`

## 📚 Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Node.js + PostgreSQL Connection Guide](https://node-postgres.com/)
- [Neon Connection String Format](https://neon.tech/docs/connect/connect-from-any-app)
