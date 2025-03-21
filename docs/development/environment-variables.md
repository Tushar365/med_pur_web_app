# Environment Variables Guide for MedSync

This document provides a comprehensive guide to the environment variables used in the MedSync application, explaining their purpose and usage in different deployment environments.

## Core Environment Variables

These environment variables are essential for the application to function properly:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:password@host:port/database` |
| `SESSION_SECRET` | Secret key for encrypting session data | Yes | `a-long-random-string` |
| `PORT` | Port the server will listen on | No (default: 5000) | `3000` |
| `NODE_ENV` | Environment mode (development/production) | No (default: development) | `production` |

## PostgreSQL Connection Variables

These variables provide individual components of the database connection:

| Variable | Description | Required if no DATABASE_URL | Example |
|----------|-------------|----------|---------|
| `PGHOST` | PostgreSQL server hostname | Yes | `localhost` or `db.railway.app` |
| `PGPORT` | PostgreSQL server port | Yes | `5432` |
| `PGDATABASE` | PostgreSQL database name | Yes | `medsync` |
| `PGUSER` | PostgreSQL username | Yes | `postgres` |
| `PGPASSWORD` | PostgreSQL password | Yes | `your-password` |

## Security Variables

These variables control security-related features:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `COOKIE_SECRET` | Secret for cookie signing | No (uses SESSION_SECRET if not provided) | `another-long-random-string` |
| `CORS_ORIGIN` | Allowed origins for CORS | No (default: *) | `https://yourapp.com` |
| `MAX_LOGIN_ATTEMPTS` | Max number of login attempts before lockout | No (default: 5) | `3` |

## Feature Flags

These variables enable or disable specific features:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `ENABLE_SMS_NOTIFICATIONS` | Enable SMS notifications feature | No (default: false) | `true` |
| `ENABLE_EMAIL_NOTIFICATIONS` | Enable email notifications feature | No (default: false) | `true` |
| `DEMO_MODE` | Enable demo mode with seeded data | No (default: false) | `true` |

## API Integration Variables

These variables are used for third-party service integrations:

| Variable | Description | Required for feature | Example |
|----------|-------------|----------|---------|
| `SMTP_HOST` | SMTP server for sending emails | Only if email notifications enabled | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Only if email notifications enabled | `587` |
| `SMTP_USER` | SMTP username | Only if email notifications enabled | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | Only if email notifications enabled | `your-app-password` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS | Only if SMS notifications enabled | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Only if SMS notifications enabled | `your-auth-token` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | Only if SMS notifications enabled | `+1234567890` |

## Environment-Specific Configuration

### Development Environment

For local development, create a `.env` file in the project root with these minimum variables:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/medsync
SESSION_SECRET=your-development-secret
```

### Production Environment

In production (Vercel, Heroku, etc.), set these environment variables through the platform's dashboard:

```
DATABASE_URL=postgresql://user:password@your-prod-db-host:5432/medsync-prod
SESSION_SECRET=your-very-secure-production-secret
NODE_ENV=production
```

### Testing Environment

For running tests, you might want to use a separate test database:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/medsync-test
SESSION_SECRET=test-secret
NODE_ENV=test
```

## Setting Environment Variables

### Local Development

For local development, you can:

1. Create a `.env` file in the project root
2. Export variables in your terminal before running the app:
   ```bash
   export DATABASE_URL=postgresql://postgres:password@localhost:5432/medsync
   npm run dev
   ```

### Railway Deployment

When using Railway for your database:

1. Get the connection details from your Railway PostgreSQL instance
2. Set these as environment variables in your Vercel project settings

### Vercel Deployment

In Vercel:

1. Go to your project settings
2. Navigate to the "Environment Variables" section
3. Add each variable and its value
4. Redeploy your application for the changes to take effect

## Accessing Environment Variables

### Backend (Node.js/Express)

In the backend code, access environment variables using:

```typescript
const port = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;
```

### Frontend (React)

In the frontend code, only expose variables that are explicitly meant for the client side by prefixing them with `VITE_` and accessing them with:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Important Security Note**: Never expose sensitive environment variables (like database credentials or API keys) to the frontend. These should only be used in server-side code.

## Troubleshooting Environment Variables

If your application isn't working as expected:

1. Check that all required environment variables are set
2. Verify that environment variable values don't contain unexpected characters
3. Ensure that the DATABASE_URL format is correct
4. For Vercel deployments, redeploy after making changes to environment variables
5. Look for error messages related to missing environment variables in the logs

## Best Practices

1. **Never commit environment variables to source control**
2. Use different values for different environments (development, testing, production)
3. Rotate secrets periodically for security
4. Use strong, random values for secrets
5. Limit access to production environment variables to authorized personnel only