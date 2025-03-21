# Deploying MedSync to Vercel

This guide provides step-by-step instructions for deploying the MedSync application to Vercel, connecting it with your Railway PostgreSQL database.

## Prerequisites

- A GitHub, GitLab, or Bitbucket repository containing your MedSync project
- A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
- A PostgreSQL database set up on Railway (see [Railway Setup Guide](./railway-setup.md))

## Step 1: Prepare Your Project for Deployment

Before deploying to Vercel, ensure your project is properly configured:

### Create a `vercel.json` Configuration File

Create a `vercel.json` file in the root of your project with the following content:

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

### Update package.json Build Script

Ensure your package.json has the correct build command:

```json
"scripts": {
  "build": "npm run build:client",
  "build:client": "cd client && npm install && npm run build",
  "dev": "tsx server/index.ts",
  "start": "node dist/server/index.js"
}
```

## Step 2: Create a New Project on Vercel

1. Log in to your Vercel dashboard at [vercel.com](https://vercel.com)
2. Click "Add New" and select "Project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket) if you haven't already
4. Select the repository containing your MedSync project
5. Vercel will automatically detect your project settings

## Step 3: Configure Environment Variables

Before deploying, you need to add environment variables from your Railway database:

1. In the Vercel project setup, click on "Environment Variables"
2. Add the following variables with values from your Railway PostgreSQL database:
   - `DATABASE_URL`: The full PostgreSQL connection string from Railway
   - `PGHOST`: The host from Railway
   - `PGUSER`: The username from Railway
   - `PGPORT`: The port from Railway
   - `PGDATABASE`: The database name from Railway
   - `PGPASSWORD`: The password from Railway
   - `SESSION_SECRET`: A random secure string for session encryption (you can generate one using a tool like [passwordsgenerator.net](https://passwordsgenerator.net/))

![Vercel Environment Variables](../assets/vercel-env-variables.png)

## Step 4: Deploy Your Project

1. After configuring the environment variables, click "Deploy"
2. Vercel will start the build and deployment process
3. You can monitor the deployment progress in the Vercel dashboard

## Step 5: Verify the Deployment

Once the deployment is complete:

1. Click on the deployment URL provided by Vercel
2. Verify that the application loads correctly
3. Test the login functionality with an existing account
4. Test other features to ensure they're working properly with your Railway database

## Step 6: Configure Custom Domain (Optional)

If you want to use a custom domain for your application:

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Click "Add" and enter your domain name
3. Follow Vercel's instructions to configure your DNS settings

## Step 7: Set Up Continuous Deployment

Vercel automatically sets up continuous deployment with your Git repository:

1. When you push changes to your repository, Vercel will automatically build and deploy the updates
2. You can configure which branches trigger deployments in your project settings
3. For production deployments, it's recommended to use the main/master branch

## Deployment Troubleshooting

### Build Failures

If your deployment fails during the build phase:

1. Check the build logs in the Vercel dashboard for error messages
2. Common issues include:
   - Missing dependencies
   - TypeScript compilation errors
   - Environment variable issues

### Runtime Errors

If your application deploys but doesn't work correctly:

1. Check the function logs in the Vercel dashboard
2. Verify that your application can connect to the Railway database
3. Ensure all environment variables are correctly set

### Database Connection Issues

If your application can't connect to the database:

1. Verify that the Railway database is accessible from Vercel
2. Check if your IP allowlist settings on Railway are preventing connections
3. Confirm that your DATABASE_URL and other environment variables are correct

## Performance Optimization Tips

To optimize your Vercel deployment:

1. **Edge Caching**: Use Vercel's edge caching for static assets
2. **Serverless Function Optimization**: Keep your API handlers small and efficient
3. **Prerendering**: Consider using static site generation for parts of your application

## Resource Monitoring

Monitor your application's resource usage:

1. Vercel provides usage analytics in the dashboard
2. Set up alerts for unusual traffic or errors
3. Monitor your Railway database performance separately

## Next Steps

After deploying your application to Vercel, you might want to:

- Set up monitoring and alerting
- Configure a CI/CD pipeline for testing
- Implement a staging environment for testing changes before production
- Review the [API Endpoints Documentation](../api/endpoints.md) for integration with other services