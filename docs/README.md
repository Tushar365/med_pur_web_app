# MedSync Documentation

Welcome to the MedSync documentation. This comprehensive guide provides detailed information on setting up, using, and extending the MedSync pharmacy management system.

## Documentation Sections

### Development Guides

- [Local Development Setup](./development/local-setup.md) - Setting up MedSync locally
- [Environment Variables](./development/environment-variables.md) - Configuration through environment variables

### Database Documentation

- [Database Schema Reference](./database/schema.md) - Comprehensive schema documentation
- [Database Migrations](./database/migrations.md) - How to evolve the database schema

### API Documentation

- [API Endpoints Reference](./api/endpoints.md) - Complete API documentation

### Deployment Guides

- [Railway PostgreSQL Setup](./deployment/railway-setup.md) - Setting up the PostgreSQL database on Railway
- [Vercel Deployment Guide](./deployment/vercel-deployment.md) - Deploying the application to Vercel

## Project Overview

MedSync is a comprehensive medicine ordering and inventory management system designed specifically for pharmacies in India. Key features include:

- **User Management**: Authentication and role-based access control
- **Franchise Management**: Support for multiple pharmacy locations
- **Inventory Management**: Track stock levels and receive low-stock alerts
- **Customer Management**: Track customer information and purchase history
- **Order Processing**: Create and manage orders with GST tax calculations
- **Dashboard Analytics**: Get insights into sales, inventory, and customer trends

## Technology Stack

MedSync is built using modern technologies:

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI Components
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel (frontend and API), Railway (PostgreSQL)

## Getting Help

If you encounter issues or have questions not covered in the documentation:

1. Check the troubleshooting sections in the relevant documentation
2. Review the [GitHub repository](https://github.com/yourusername/medsync) for open issues
3. Contact the maintenance team through the repository's issue tracker

## Contributing to Documentation

Contributions to this documentation are welcome:

1. Fork the repository
2. Make your changes to the relevant Markdown files
3. Submit a pull request with a clear description of your improvements

## License

MedSync and its documentation are licensed under the MIT License. See the LICENSE file in the project repository for details.

---

*Last updated: March 21, 2025*