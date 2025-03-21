# Railway PostgreSQL Database Setup Guide for MedSync

This guide provides step-by-step instructions for setting up a PostgreSQL database on Railway for use with the MedSync application.

## What is Railway?

[Railway](https://railway.app) is a deployment platform that makes it easy to deploy infrastructure components like databases, message queues, and more. It provides a simple interface for setting up and managing PostgreSQL databases with automatic backups, scaling options, and monitoring.

## Prerequisites

Before you begin, make sure you have:

1. A [Railway account](https://railway.app/login)
2. Basic knowledge of PostgreSQL database management
3. The MedSync application code ready for connection

## Setting Up a PostgreSQL Database on Railway

### Step 1: Create a Railway Project

1. Log in to your Railway account
2. Click on "New Project" in the dashboard
3. Select "Provision PostgreSQL" from the options

![Railway New Project](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/railway-new-project.png)

### Step 2: Configure the Database

Once your PostgreSQL database is provisioned:

1. Click on the PostgreSQL service in your project
2. Go to the "Variables" tab
3. Note that Railway has automatically created environment variables for your database connection:
   - `PGHOST`: The host address for your PostgreSQL server
   - `PGDATABASE`: The name of your database
   - `PGUSER`: The username for connecting to your database
   - `PGPASSWORD`: The password for your database user
   - `DATABASE_URL`: A connection string that includes all the above information

![Railway PostgreSQL Variables](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/railway-variables.png)

### Step 3: Set Up Database Schema

You have two options for initializing your database schema:

#### Option 1: Using Drizzle ORM's Schema Push (Recommended)

1. Set up your local `.env` file with the Railway PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

2. Run the database schema push command:
   ```bash
   npm run db:push
   ```

3. This will automatically create all the necessary tables and indexes based on your schema definition in `shared/schema.ts`.

#### Option 2: Manual SQL Schema Initialization

1. Connect to your Railway PostgreSQL database using a database client (like pgAdmin, DBeaver, or TablePlus)
2. Use the provided SQL initialization script from `docs/database/init.sql`
3. Execute the script to create all necessary tables and indexes

### Step 4: Connect Your MedSync Application to Railway

#### For Local Development

Update your local `.env` file with the Railway PostgreSQL credentials:

```
# PostgreSQL Configuration (from Railway)
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-railway-postgresql-host
PGPORT=5432
PGUSER=your-railway-postgresql-username
PGPASSWORD=your-railway-postgresql-password
PGDATABASE=railway
```

#### For Production Deployment on Vercel

1. Go to your Vercel project settings
2. Navigate to the Environment Variables section
3. Add the Railway PostgreSQL credentials as environment variables
4. Redeploy your application to use the new environment variables

## Database Management Tips

### Monitoring Your Database

Railway provides built-in monitoring for your PostgreSQL database:

1. Go to your Railway project
2. Select the PostgreSQL service
3. Navigate to the "Metrics" tab to view:
   - CPU usage
   - Memory usage
   - Storage usage
   - Active connections

### Database Backups

Railway automatically creates backups of your PostgreSQL database:

1. Go to your Railway project
2. Select the PostgreSQL service
3. Navigate to the "Backups" tab
4. Here you can:
   - View scheduled backups
   - Create manual backups
   - Restore from existing backups

### Scaling Your Database

As your application grows, you may need to scale your database:

1. Go to your Railway project
2. Select the PostgreSQL service
3. Navigate to the "Settings" tab
4. Under "Instance Size," select a larger plan as needed

## Database Security Best Practices

1. **Don't commit database credentials to your repository**
   - Always use environment variables for sensitive information
   - Include database credentials in your `.gitignore` file

2. **Restrict network access**
   - Use Railway's networking features to restrict access to your database
   - Consider setting up IP allowlisting for production databases

3. **Regular password rotation**
   - Periodically change your database passwords
   - Update all environments with the new credentials

4. **Monitor database access**
   - Regularly check the logs for unauthorized access attempts
   - Set up alerts for unusual database activity

## Troubleshooting Common Issues

### Connection Timeout

If you're experiencing connection timeouts:

1. Check that your application is using the correct connection string
2. Verify that your IP address is allowed to access the database
3. Ensure you haven't exceeded the connection limit for your database plan

### Schema Push Failures

If `npm run db:push` fails:

1. Check that your DATABASE_URL environment variable is correctly set
2. Verify that your user has the necessary permissions to create tables
3. Look for conflicts between your local schema and the existing database schema

### Performance Issues

If your database is running slowly:

1. Check the database metrics in Railway
2. Look for slow queries that might need optimization
3. Consider upgrading your database plan for more resources

## Migrating from Local Development to Railway

If you've been developing with a local PostgreSQL database:

1. Export your local database schema:
   ```bash
   npm run db:generate
   ```

2. Set up your Railway PostgreSQL database as described above

3. Update your environment variables to use the Railway database

4. Apply your schema to the Railway database:
   ```bash
   npm run db:push
   ```

## Next Steps

After successfully setting up your Railway PostgreSQL database:

1. Configure your [Vercel deployment](/docs/deployment/vercel-deployment.md) to connect to your Railway database
2. Set up proper environment variables for all your deployment environments
3. Implement a database backup strategy beyond Railway's automated backups
4. Consider setting up database read replicas for high-traffic applications

## Conclusion

You should now have a fully functional PostgreSQL database hosted on Railway for your MedSync application. This setup provides a reliable, scalable database solution that works seamlessly with the MedSync Pharmacy Management System.