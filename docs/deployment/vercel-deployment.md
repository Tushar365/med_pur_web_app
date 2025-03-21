# Vercel Deployment Guide for MedSync

This guide provides detailed instructions for deploying the MedSync application to Vercel, a cloud platform for static sites and serverless functions.

## What is Vercel?

[Vercel](https://vercel.com) is a cloud platform for static sites and serverless functions that enables developers to host websites and web applications with zero configuration. It provides features like:

- Global CDN
- Automatic SSL
- Continuous deployment from Git
- Serverless functions
- Environment variables management
- Preview deployments for pull requests

## Prerequisites

Before you begin, make sure you have:

1. A [Vercel account](https://vercel.com/signup) (you can sign up with your GitHub, GitLab, or Bitbucket account)
2. Your MedSync codebase in a Git repository (GitHub, GitLab, or Bitbucket)
3. A PostgreSQL database set up (preferably on [Railway](/docs/deployment/railway-setup.md))

## Deployment Steps

### Step 1: Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click on "Add New..." and select "Project"
3. Import your Git repository containing the MedSync application
4. If you don't see your repository, make sure you've granted Vercel access to your Git provider

![Vercel Import Repository](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/vercel-import.png)

### Step 2: Configure Your Project

Once you've selected your repository, you'll need to configure your project:

1. **Project Name**: Enter a name for your project (e.g., "medsync" or "pharmacy-system")
2. **Framework Preset**: Vercel should automatically detect that this is a Node.js project
3. **Root Directory**: Leave as `.` (the repository root)
4. **Build Command**: Vercel will use the build command from your `vercel.json` file
5. **Output Directory**: Vercel will use the output directory from your `vercel.json` file
6. **Environment Variables**: Add the necessary environment variables (see next section)

### Step 3: Set Up Environment Variables

Add the following environment variables to your Vercel project:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://username:password@host:port/database` |
| `SESSION_SECRET` | Secret key for session encryption | `a-very-long-random-string` |
| `NODE_ENV` | Environment mode | `production` |

If you're using Railway for your database, you can get these values from your Railway project dashboard.

![Vercel Environment Variables](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/vercel-env-vars.png)

### Step 4: Deploy Your Application

1. Click "Deploy" to start the deployment process
2. Vercel will clone your repository, install dependencies, build your application, and deploy it
3. Once the deployment is complete, you'll see a success message with a URL to your deployed application

![Vercel Deployment Success](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/vercel-deploy-success.png)

### Step 5: Initialize Your Database Schema

After your application is deployed, you need to initialize your database schema:

1. Make sure your DATABASE_URL environment variable is correctly set up
2. Run the database schema push command locally:
   ```bash
   npm run db:push
   ```

This will create all the necessary tables and indexes in your production database based on your schema definition in `shared/schema.ts`.

## Managing Your Deployment

### Viewing Deployment Status

You can view the status of your deployment in the Vercel dashboard:

1. Go to your Vercel dashboard
2. Select your MedSync project
3. Navigate to the "Deployments" tab to see all your deployments
4. Click on a deployment to see detailed logs and information

### Setting Up Custom Domains

To use a custom domain for your MedSync application:

1. Go to your Vercel project settings
2. Navigate to the "Domains" tab
3. Click "Add" and enter your domain name
4. Follow the instructions to configure your DNS settings

![Vercel Custom Domain](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/vercel-domains.png)

### Continuous Deployment

Vercel automatically deploys your application whenever you push changes to your Git repository:

1. Make changes to your codebase locally
2. Commit and push the changes to your Git repository
3. Vercel will automatically detect the changes and create a new deployment
4. If the build is successful, Vercel will update your production deployment

### Preview Deployments

Vercel creates preview deployments for pull requests:

1. Create a new branch in your Git repository
2. Make changes and create a pull request
3. Vercel will automatically create a preview deployment for your pull request
4. You can test your changes in the preview deployment before merging them into the main branch

![Vercel Preview Deployments](https://raw.githubusercontent.com/yourusername/medsync/main/docs/images/vercel-preview.png)

## Advanced Configuration

### Environment Variable Overrides

You can set different environment variables for different deployment environments:

1. Go to your Vercel project settings
2. Navigate to the "Environment Variables" tab
3. Click "Add" to add a new environment variable
4. Select which environments the variable should apply to (Production, Preview, Development)

### Serverless Function Configuration

MedSync's API routes are deployed as serverless functions. You can configure them in your `vercel.json` file:

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
  ]
}
```

### Vercel CLI

You can use the Vercel CLI to manage your deployments locally:

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy your application:
   ```bash
   vercel
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Build Failures

If your deployment fails during the build process:

1. Check the build logs in the Vercel dashboard
2. Make sure your dependencies are correctly specified in your `package.json` file
3. Verify that your build commands are correct in your `vercel.json` file
4. Ensure your environment variables are correctly set

### API Routes Not Working

If your API routes are not working:

1. Check the function logs in the Vercel dashboard
2. Verify that your `vercel.json` routes configuration is correct
3. Make sure your API routes are correctly defined in your codebase
4. Check that your database connection is working correctly

### Database Connection Issues

If your application cannot connect to your database:

1. Verify that your DATABASE_URL environment variable is correctly set
2. Make sure your database is accessible from Vercel's servers
3. Check if your database provider (e.g., Railway) has any network restrictions

## Best Practices

### Security

1. **Always use environment variables for sensitive information**
   - Never hardcode database credentials, API keys, or secrets in your codebase
   - Use Vercel's environment variables feature to store sensitive information

2. **Enable two-factor authentication for your Vercel account**
   - Go to your Vercel account settings
   - Navigate to the "Security" tab
   - Follow the instructions to enable two-factor authentication

### Performance

1. **Optimize your client-side code**
   - Minimize JavaScript bundle size
   - Use code splitting with dynamic imports
   - Optimize images and static assets

2. **Use Vercel's Edge Network**
   - Enable Vercel's Edge Caching for static assets
   - Use Vercel's Image Optimization API for images

### Cost Optimization

1. **Monitor your serverless function usage**
   - Vercel's free tier includes a limited number of serverless function executions
   - Monitor your usage in the Vercel dashboard
   - Optimize your serverless functions to reduce execution time and cost

2. **Use appropriate plan for your needs**
   - Vercel offers different plans with varying limits
   - Choose the plan that best fits your usage and budget

## Next Steps

After successfully deploying your MedSync application to Vercel:

1. Set up monitoring and analytics to track your application's performance
2. Implement a CI/CD pipeline for automated testing before deployment
3. Create a backup and disaster recovery plan
4. Consider using Vercel's Edge Functions for improved performance

## Conclusion

You should now have your MedSync application successfully deployed to Vercel, with continuous deployment from your Git repository and connected to your PostgreSQL database on Railway. This setup provides a modern, scalable, and easy-to-maintain deployment solution for your pharmacy management system.