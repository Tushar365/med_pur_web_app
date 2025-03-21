# Vercel Deployment Guide for MedSync

This guide provides step-by-step instructions for deploying the MedSync application to Vercel.

## Prerequisites

Before deploying to Vercel, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. Your project code in a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database set up on Railway or another provider
4. Environment variables ready (see [Environment Variables Guide](../development/environment-variables.md))

## Step 1: Prepare Your Project

Ensure your project has the required configuration files:

1. **vercel.json** - This file should exist at the root of your project with the following configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **package.json** - Make sure the build script is properly configured:

```json
"scripts": {
  "build": "npm run build:client",
  "build:client": "cd client && npm run build"
}
```

## Step 2: Connect to Vercel

1. Log in to your [Vercel dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your repository from GitHub, GitLab, or Bitbucket
4. Select the repository that contains your MedSync project

## Step 3: Configure Project Settings

1. **Project Name**: Enter a name for your deployment (e.g., "medsync")
2. **Framework Preset**: Select "Other"
3. **Root Directory**: Leave as default (not required for our project structure)
4. **Build and Output Settings**: These should be auto-detected from your vercel.json file

## Step 4: Configure Environment Variables

Add all required environment variables to your Vercel project:

1. Navigate to the "Environment Variables" section
2. Add the following variables:
   - `DATABASE_URL`: Your Railway PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for session encryption
   - `NODE_ENV`: Set to "production"
   - Add any other variables needed for your deployment

## Step 5: Deploy

1. Click on the "Deploy" button
2. Vercel will clone your repository, build the project, and deploy it
3. Once deployed, Vercel will provide you with a URL for your application

## Step 6: Verify Deployment

1. Visit the provided URL to ensure your application is running correctly
2. Test key functionality including:
   - User authentication (login/logout)
   - Product management
   - Customer management
   - Order processing
   - Dashboard analytics

## Common Deployment Issues

### Database Connection Problems

If you encounter database connection issues:

1. Verify your `DATABASE_URL` is correct
2. Ensure the database is accessible from Vercel's servers
3. Check that Railway's IP allowlist includes Vercel's deployment servers

### Build Failures

If the build process fails:

1. Check the build logs in Vercel's deployment details
2. Ensure all dependencies are correctly listed in package.json
3. Verify that your code works locally with the build script

### Runtime Errors

If the application builds but doesn't run correctly:

1. Check browser console for frontend errors
2. Review Vercel's function logs for backend errors
3. Verify environment variables are correctly set and accessible

## Custom Domain Setup

To use your own domain with your Vercel deployment:

1. Go to your project settings in Vercel
2. Click on "Domains"
3. Enter your domain name
4. Follow Vercel's instructions to verify domain ownership
5. Update your DNS settings as instructed by Vercel

## Continuous Deployment

Vercel automatically sets up continuous deployment from your Git repository:

1. Every push to the main/master branch will trigger a new production deployment
2. Pull requests will create preview deployments
3. You can customize branch deployments in the Git Integration settings

## Deployment Protection

Consider adding these additional security measures:

1. **Environment Variable Encryption**: Vercel automatically encrypts environment variables
2. **Password Protection**: Add password protection to preview deployments
3. **Team Access Control**: If using Vercel teams, manage who can deploy or view the project

## Monitoring and Logs

After deployment, monitor your application's performance:

1. Use Vercel's built-in Analytics for usage insights
2. Check function logs to troubleshoot backend issues
3. Set up status badges on your repository to show deployment status

## Rollbacks

If you need to revert to a previous version:

1. Go to the "Deployments" section in your Vercel project
2. Find the deployment you want to revert to
3. Click "..." and select "Promote to Production"

## Conclusion

Your MedSync application should now be successfully deployed to Vercel with a database connection to Railway. The application is now accessible to users worldwide with Vercel's global CDN ensuring fast load times across all regions.

## Next Steps

- [Set up a custom domain](https://vercel.com/docs/concepts/projects/domains)
- [Configure Vercel for Teams](https://vercel.com/docs/concepts/teams/overview) if working with multiple developers
- Review [Vercel's pricing plans](https://vercel.com/pricing) as your project grows
- Set up [monitoring and alerting](https://vercel.com/docs/analytics) for production issues