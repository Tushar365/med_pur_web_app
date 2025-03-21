# Environment Variables Guide for MedSync

This document provides information about all environment variables used in the MedSync application, their purpose, and how to configure them in different environments.

## Overview

Environment variables are used to store configuration settings that may vary between different deployment environments (development, staging, production) or contain sensitive information such as API keys and database credentials.

## Required Environment Variables

### Database Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://username:password@localhost:5432/medsync` |
| `PGHOST` | PostgreSQL host | No* | `localhost` |
| `PGPORT` | PostgreSQL port | No* | `5432` |
| `PGUSER` | PostgreSQL username | No* | `postgres` |
| `PGPASSWORD` | PostgreSQL password | No* | `password123` |
| `PGDATABASE` | PostgreSQL database name | No* | `medsync` |

*Note: If `DATABASE_URL` is provided, the individual PostgreSQL connection parameters (`PGHOST`, `PGPORT`, etc.) are not required. However, if `DATABASE_URL` is not set, all individual parameters must be provided.

### Server Configuration

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Port for the Express server | No (default: 3000) | `5000` |
| `NODE_ENV` | Environment mode | No (default: development) | `production`, `development`, `test` |
| `SESSION_SECRET` | Secret for session encryption | Yes | `your-secure-random-string` |
| `COOKIE_SECRET` | Secret for cookie signing | No | `another-secure-random-string` |
| `CORS_ORIGIN` | Allowed CORS origins | No | `http://localhost:3000` |

### Feature Flags

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `ENABLE_SMS_NOTIFICATIONS` | Enable SMS notifications | No (default: false) | `true`, `false` |
| `ENABLE_EMAIL_NOTIFICATIONS` | Enable email notifications | No (default: false) | `true`, `false` |
| `DEMO_MODE` | Enable demo mode | No (default: false) | `true`, `false` |

### Notification Services

#### SMTP Settings (for Email)

| Variable | Description | Required if emails enabled | Example |
|----------|-------------|---------------------------|---------|
| `SMTP_HOST` | SMTP server hostname | Yes | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | Yes | `587` |
| `SMTP_USER` | SMTP username | Yes | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP password | Yes | `your-email-password` |
| `SMTP_FROM` | Default sender email | No | `noreply@yourapp.com` |

#### Twilio Settings (for SMS)

| Variable | Description | Required if SMS enabled | Example |
|----------|-------------|--------------------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | Yes | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | Yes | `your-auth-token` |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number | Yes | `+14155552671` |

## Environment-Specific Variables

### Development Environment

For local development, create a `.env` file in the root directory of your project with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medsync

# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=development-session-secret

# Feature Flags
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_EMAIL_NOTIFICATIONS=false
DEMO_MODE=true
```

### Testing Environment

For testing environments, consider using a separate database to avoid affecting development data:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medsync_test

# Server Configuration
PORT=3000
NODE_ENV=test
SESSION_SECRET=test-session-secret

# Feature Flags
ENABLE_SMS_NOTIFICATIONS=false
ENABLE_EMAIL_NOTIFICATIONS=false
DEMO_MODE=true
```

### Production Environment

In production environments, ensure all secrets are strong and unique:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@your-db-host:5432/medsync_prod

# Server Configuration
PORT=3000
NODE_ENV=production
SESSION_SECRET=long-random-string-for-production
COOKIE_SECRET=another-long-random-string

# Feature Flags
ENABLE_SMS_NOTIFICATIONS=true
ENABLE_EMAIL_NOTIFICATIONS=true
DEMO_MODE=false

# Production-specific settings
# Add any additional production-specific variables here
```

## Managing Environment Variables

### Local Development

For local development, create a `.env` file in the root directory of your project. This file should not be committed to your Git repository (it's included in `.gitignore`).

If you're working in a team, create a `.env.example` file with the required variables but without actual values, which can be committed to the repository.

### Production Deployment

When deploying to production:

1. **Vercel**: Add environment variables through the Vercel dashboard or CLI. See [Vercel Deployment Guide](/docs/deployment/vercel-deployment.md) for more information.

2. **Railway**: Add environment variables through the Railway dashboard. See [Railway Setup Guide](/docs/deployment/railway-setup.md) for more information.

3. **Docker**: Pass environment variables through Docker Compose or as arguments when running Docker containers. See [Docker Deployment Guide](/docs/deployment/docker-deployment.md) for more information.

## Security Best Practices

1. **Never commit secrets to your repository**
   - Keep your `.env` file in your `.gitignore`
   - Use environment variable management in your deployment platform

2. **Use strong, unique secrets**
   - Generate long, random strings for `SESSION_SECRET` and other secrets
   - Use different secrets for different environments

3. **Rotate secrets periodically**
   - Change your secrets periodically to improve security
   - Update all environments with the new secrets

4. **Limit access to environment variables**
   - Only share secrets with team members who need them
   - Use proper access controls in your deployment platform

5. **Validate environment variables at startup**
   - Check for required environment variables when your application starts
   - Provide clear error messages if required variables are missing

## Accessing Environment Variables

### In Node.js/Express (Backend)

Access environment variables using `process.env`:

```typescript
// server/index.ts
const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

app.use(session({
  secret: sessionSecret,
  // other options...
}));
```

### In React (Frontend)

Environment variables for the frontend must be prefixed with `VITE_` to be exposed to the client-side code:

```typescript
// client/src/config.ts
export const apiUrl = import.meta.env.VITE_API_URL || '/api';
export const isDevelopment = import.meta.env.DEV;
```

**Important**: Never expose sensitive information like API keys or secrets in the frontend code. These should always be kept on the server side.

## Troubleshooting

### Environment Variables Not Working

If your environment variables are not being recognized:

1. Make sure your `.env` file is in the correct location (root directory of your project)
2. Verify that the variable names are correct (including case)
3. Check if you're using the correct prefix for frontend variables (`VITE_`)
4. Restart your development server after making changes to environment variables

### Environment Variables in Docker

If you're using Docker and environment variables are not being passed to your containers:

1. Check your `docker-compose.yml` file for correct environment variable configuration
2. Make sure you're passing environment variables when running Docker containers
3. Consider using Docker secrets for sensitive information

## Conclusion

Properly managing environment variables is essential for a secure and flexible application. By following the guidelines in this document, you can ensure that your MedSync application is properly configured in all environments.