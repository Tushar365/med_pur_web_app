# Setting Up PostgreSQL on Railway

This guide provides step-by-step instructions for setting up and configuring a PostgreSQL database on Railway.com for the MedSync application.

## Prerequisites

- A Railway.com account (sign up at [railway.app](https://railway.app) if you don't have one)
- Basic understanding of PostgreSQL and database concepts

## Step 1: Create a New Project on Railway

1. Log in to your Railway dashboard at [railway.app](https://railway.app)
2. Click the "New Project" button in the dashboard
3. Select "PostgreSQL" from the available options
4. Railway will automatically provision a new PostgreSQL database

## Step 2: Access Your Database Details

Once your PostgreSQL database is created:

1. Click on the database service in your project dashboard
2. Go to the "Connect" tab
3. You will see your database connection details including:
   - Connection string (for DATABASE_URL)
   - Individual connection parameters (PGHOST, PGUSER, etc.)

![Railway Database Details](../assets/railway-connection-details.png)

## Step 3: Configure Database Access

By default, Railway databases are protected by IP allowlisting. You can configure this in the settings:

1. In your database dashboard, go to the "Settings" tab
2. Scroll to the "Network" section
3. Choose one of the following options:
   - **Public**: Allow connections from anywhere (not recommended for production)
   - **Private Networking**: Add specific IP addresses that can connect

## Step 4: Set Up Database Schema

You need to create the database schema required by MedSync. You have two options:

### Option A: Using Drizzle ORM (Recommended)

1. Set the `DATABASE_URL` environment variable in your local development environment with your Railway connection string
   ```
   export DATABASE_URL=postgresql://postgres:password@host:port/railway
   ```
2. Run the Drizzle schema migration:
   ```bash
   npm run db:push
   ```

### Option B: Using the Railway SQL Editor

1. In your Railway database dashboard, click on the "SQL Editor" tab
2. Paste the contents of the SQL schema file from the project's attached assets:
   ```sql
   -- Create franchises table
   CREATE TABLE franchises (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     contact_number TEXT NOT NULL,
     email TEXT NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     username TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     role TEXT NOT NULL DEFAULT 'staff',
     franchise_id INTEGER REFERENCES franchises(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     last_login TIMESTAMP,
     is_active BOOLEAN DEFAULT true
   );
   
   -- Additional tables for products, customers, orders, etc.
   -- Full schema available in the project SQL file
   ```
3. Click "Run" to execute the SQL and create your database schema

## Step 5: Create a Seed Admin User (Optional)

For testing purposes, you may want to create an admin user:

```sql
INSERT INTO franchises (name, address, contact_number, email, is_active)
VALUES ('Main Branch', '123 Healthcare Street, Mumbai', '+91 9876543210', 'main@medsync.com', true);

INSERT INTO users (
  first_name, 
  last_name, 
  username, 
  password, 
  email, 
  role, 
  franchise_id, 
  is_active
)
VALUES (
  'Admin',
  'User',
  'admin',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8.salt', -- password: password123
  'admin@medsync.com',
  'admin',
  1,
  true
);
```

## Step 6: Managing Your Database

Railway provides several tools for ongoing database management:

- **SQL Editor**: For running custom queries and database operations
- **Metrics**: Monitor database performance and usage
- **Backup/Restore**: Set up automated backups of your data
- **Variables**: Manage database configuration variables

## Step 7: Connect Your Application

When deploying your application to Vercel or another platform, you'll need to configure the following environment variables using the values from Railway:

```
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-pg-host
PGUSER=your-pg-user
PGPASSWORD=your-pg-password
PGDATABASE=your-pg-database
PGPORT=your-pg-port
```

## Troubleshooting Railway Database Connections

### Connection Issues

If you're having trouble connecting to your Railway database:

1. **Check IP Allowlisting**: Ensure your application's IP address is allowed to connect
2. **Verify Credentials**: Double-check your connection string and credentials
3. **Connection Limits**: Railway has connection limits on different plans, check if you're exceeding them

### Performance Issues

If your database is slow:

1. Check the Metrics tab to identify potential bottlenecks
2. Consider optimizing queries or adding indexes to frequently queried tables
3. Upgrade your Railway plan if you need more resources

## Railway Pricing and Plans

Railway offers several pricing tiers:

- **Free Tier**: Limited resources, suitable for development
- **Developer Tier**: More resources for small production applications
- **Team/Business Tiers**: For larger applications with higher demands

Check the [Railway pricing page](https://railway.app/pricing) for the most current information.

## Next Steps

After setting up your PostgreSQL database on Railway, proceed to:

- [Vercel Deployment Guide](./vercel-deployment.md) to deploy your application
- [Database Schema Overview](../database/schema.md) to understand the data structure