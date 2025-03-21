# MedSync: Pharmacy Management System

A comprehensive medicine ordering and inventory management system tailored for pharmacies in India.

![MedSync Logo](/client/public/logo.svg)

## Overview

MedSync is a full-stack web application built with modern technologies to streamline pharmacy operations. The system helps manage inventory, track customers, process orders, and provide valuable business insights through an intuitive dashboard.

### Key Features

- **User Authentication**: Secure login for staff members with role-based access control
- **Franchise Management**: Support for multi-location pharmacy businesses
- **Inventory Management**: Track medicine stock across locations with low-stock alerts
- **Customer Management**: Store and manage customer information for repeat orders
- **Order Processing**: Create and manage orders with automatic tax calculation
- **Dashboard Analytics**: View critical business metrics and performance indicators
- **GST Compliance**: Built-in support for Indian GST tax requirements

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **State Management**: TanStack Query
- **Deployment**: Vercel (frontend), Railway (database)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/medsync.git
   cd medsync
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Configure your database connection settings

4. Initialize the database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

### Demo Account

For testing purposes, you can use the following credentials:
- Username: `demo`
- Password: `demo123`

## Documentation

Detailed documentation is available in the `/docs` directory:

- [API Endpoints](/docs/api/endpoints.md)
- [Database Schema](/docs/database/schema.md)
- [Database Migrations](/docs/database/migrations.md)
- [Local Development Setup](/docs/development/local-setup.md)
- [Environment Variables](/docs/development/environment-variables.md)
- [Railway Database Setup](/docs/deployment/railway-setup.md)
- [Vercel Deployment Guide](/docs/deployment/vercel-deployment.md)

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       └── pages/          # Page components
├── server/                 # Backend Express application
│   ├── db.ts               # Database connection
│   ├── storage.ts          # Data access layer
│   ├── routes.ts           # API routes
│   └── auth.ts             # Authentication logic
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema definitions
├── docs/                   # Documentation
└── vercel.json             # Vercel deployment configuration
```

## Customization

### Theming

MedSync uses a customizable theme system:

1. Edit `theme.json` to adjust colors, radius, and appearance
2. Modify TailwindCSS config in `tailwind.config.ts` for advanced customization

### Adding Features

To extend MedSync with additional features:

1. Update the database schema in `shared/schema.ts`
2. Add necessary storage methods in `server/storage.ts`
3. Create API endpoints in `server/routes.ts`
4. Implement UI components in the client

## Deployment

### Vercel Deployment

The application is preconfigured for Vercel deployment. See [Vercel Deployment Guide](/docs/deployment/vercel-deployment.md) for details.

### Railway Database

For database hosting, MedSync is designed to work with Railway PostgreSQL. See [Railway Setup Guide](/docs/deployment/railway-setup.md) for configuration steps.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the component library
- [Drizzle ORM](https://orm.drizzle.team/) for the database ORM
- [TanStack Query](https://tanstack.com/query) for data fetching
- [Vercel](https://vercel.com) and [Railway](https://railway.app) for hosting services