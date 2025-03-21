# Railway PostgreSQL Setup Guide for MedSync

This guide provides step-by-step instructions for setting up a PostgreSQL database on Railway for use with the MedSync application.

## What is Railway?

[Railway](https://railway.app/) is a modern application deployment platform that makes it easy to deploy and scale services, including PostgreSQL databases. It offers:

- Fully managed PostgreSQL databases
- Automatic backups
- Built-in monitoring
- Easy connection to other services
- Simple environment variable management

## Prerequisites

Before setting up a Railway PostgreSQL database, ensure you have:

1. A [Railway account](https://railway.app/) (Free tier available, requires GitHub account for sign-up)
2. Basic understanding of PostgreSQL databases
3. The MedSync application code ready for connection

## Step 1: Create a Railway Project

1. Log in to your [Railway dashboard](https://railway.app/dashboard)
2. Click on "New Project"
3. Select "Provision PostgreSQL"
4. Railway will automatically create a new project with a PostgreSQL database

## Step 2: Access Database Credentials

1. From your project dashboard, click on the PostgreSQL service
2. Navigate to the "Connect" tab
3. You'll find important connection details:
   - Database URL (connection string)
   - PostgreSQL Host
   - PostgreSQL Port
   - PostgreSQL Username
   - PostgreSQL Password
   - PostgreSQL Database Name

## Step 3: Secure Your Database

1. Navigate to the "Settings" tab of your PostgreSQL service
2. Under "IP Allowlist", consider adding your IP address for local development
3. For production, add Vercel's IP ranges if deploying there

## Step 4: Connect MedSync to Railway

There are two ways to connect your application to the Railway database:

### Option 1: Using Environment Variables

1. Copy the `DATABASE_URL` connection string from Railway
2. Add it to your application's environment variables:
   
   For local development, add to your `.env` file:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
   
   For Vercel deployment, add as an environment variable in your Vercel project settings

### Option 2: Using Individual Connection Parameters

For more granular control, you can use individual connection parameters:

```
PGHOST=your-railway-host.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your-password
PGDATABASE=railway
```

## Step 5: Initialize the Database Schema

After connecting your application to the Railway database:

1. Run the database migration script to set up the schema:
   ```bash
   npm run db:push
   ```

2. Verify the schema was created correctly by checking in Railway:
   - Go to the "Data" tab in your PostgreSQL service
   - You should see all the tables defined in your schema

## Step 6: Database Management

Railway provides several tools for managing your database:

### Using the Railway UI

1. **Exploring Data**: Use the "Data" tab to browse tables and records
2. **Running Queries**: Use the "Query" tab to execute SQL queries
3. **Monitoring**: View metrics in the "Metrics" tab

### Using Railway CLI

For more advanced operations, install the Railway CLI:

```bash
npm i -g @railway/cli
```

Login and connect to your project:

```bash
railway login
railway link
```

Run SQL commands directly:

```bash
railway run psql -c "SELECT * FROM users LIMIT 5;"
```

Connect via psql:

```bash
railway run psql
```

## Step 7: Backup and Restore

### Creating Backups

Railway automatically creates daily backups of your database. To create a manual backup:

1. Go to the "Backups" tab in your PostgreSQL service
2. Click "Create Backup"
3. Wait for the backup to complete

### Downloading Backups

To download a backup:

1. Select the backup from the list
2. Click "Download"
3. The backup will be downloaded as a SQL file

### Restoring from Backups

To restore from a backup:

1. Select the backup you want to restore
2. Click "Restore"
3. Confirm the restoration

## Step 8: Database Scaling

As your application grows, you may need to scale your database:

1. Navigate to the "Settings" tab of your PostgreSQL service
2. Under "Plan", you can upgrade to a higher tier for:
   - More storage
   - More connections
   - Better performance
   - Advanced features

## Step 9: Monitoring Your Database

Railway provides tools to monitor database performance:

1. Go to the "Metrics" tab to view:
   - CPU usage
   - Memory usage
   - Storage usage
   - Connection count

2. Set up alerts for critical metrics in the "Alerts" section

## Troubleshooting Railway Database Issues

### Connection Issues

If you're having trouble connecting to your Railway database:

1. Verify your connection string or credentials are correct
2. Check that your IP is in the allowlist if you've restricted access
3. Ensure your application is using TLS/SSL for the connection
4. Verify that you haven't exceeded connection limits

### Performance Issues

If experiencing slow queries:

1. Check the "Metrics" tab to see if you're approaching resource limits
2. Review your database indexes
3. Consider optimizing your queries
4. Upgrade to a higher tier if needed

### Migration Failures

If database migrations fail:

1. Check migration logs for specific errors
2. Ensure your database user has the necessary permissions
3. Try running migrations manually using the Railway SQL interface

## Railway vs. Other Database Providers

| Feature | Railway | Heroku | AWS RDS | Digital Ocean |
|---------|---------|--------|---------|---------------|
| Ease of Setup | Very Easy | Easy | Complex | Moderate |
| Free Tier | Yes (Limited) | No | No | No |
| Auto Scaling | Yes | Yes | Manual | Manual |
| Backups | Automatic | Automatic | Configurable | Manual |
| Connection Pooling | Included | Add-on | Configurable | Add-on |
| Performance | Good | Good | Excellent | Good |
| Price | $$ | $$$ | $$$$ | $$ |

## Railway PostgreSQL Limitations

Be aware of these limitations when using Railway's PostgreSQL service:

1. **Connection Limits**: Depends on your plan tier
2. **Storage Limits**: Depends on your plan tier
3. **Idle Database Spin-down**: On free tier, database may sleep after inactivity
4. **Network Restrictions**: Some plans have limited outbound connectivity

## Conclusion

Your MedSync application should now be successfully connected to a Railway PostgreSQL database. This setup provides a reliable, scalable database solution that can grow with your application needs.

## Next Steps

- [Set up automatic database migrations](../database/migrations.md)
- [Configure Vercel for deployment](./vercel-deployment.md)
- Explore [Railway's documentation](https://docs.railway.app/databases/postgresql) for advanced features