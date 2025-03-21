# MedSync Documentation

This documentation provides comprehensive guides for deploying, developing, and understanding the MedSync medicine ordering system for Indian pharmacies.

## Table of Contents

### Deployment
- [Railway PostgreSQL Setup](./deployment/railway-setup.md)
- [Vercel Deployment Guide](./deployment/vercel-deployment.md)

### Development
- [Local Development Setup](./development/local-setup.md)
- [Environment Variables Guide](./development/environment-variables.md)

### Database
- [Database Schema Overview](./database/schema.md)
- [Database Migrations Guide](./database/migrations.md)

### API
- [API Endpoints Documentation](./api/endpoints.md)

## About MedSync

MedSync is a complete medicine ordering system tailored for Indian pharmacies with support for:

- Multi-franchise management
- GST-compliant billing
- Inventory management
- Customer relationship management
- Order processing
- Comprehensive reporting and analytics

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js
- **Deployment**: Vercel (application) and Railway (database)