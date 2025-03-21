# MedSync Local Development Setup

This guide provides detailed instructions for setting up the MedSync medicine ordering system on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **PostgreSQL** (version 12 or higher) - [Download PostgreSQL](https://www.postgresql.org/download/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/medsync.git
cd medsync
```

## Step 2: Install Dependencies

Install all required project dependencies:

```bash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/medsync
PGUSER=your_postgres_username
PGHOST=localhost
PGDATABASE=medsync
PGPORT=5432
PGPASSWORD=your_postgres_password

# Session Configuration
SESSION_SECRET=your_secure_session_secret

# Server Configuration
PORT=3000
```

Replace the placeholder values with your actual PostgreSQL credentials.

## Step 4: Set Up the Database

### Create the Database

Using the PostgreSQL command line tool:

```bash
createdb medsync
```

Or using psql:

```bash
psql -U your_postgres_username
CREATE DATABASE medsync;
\q
```

### Run Database Migrations

Use Drizzle ORM to set up the database schema:

```bash
npm run db:push
```

This command will create all the necessary tables in your database according to the schema defined in the `shared/schema.ts` file.

## Step 5: Run the Development Server

Start the development server:

```bash
npm run dev
```

This will start both the Express backend and the Vite development server for the frontend. The application will be accessible at:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## Step 6: Accessing the Application

Open your browser and navigate to http://localhost:3000

You'll be redirected to the login page. You can either:

1. Register a new account using the registration form
2. Use the demo credentials:
   - Username: admin
   - Password: password123

## Customizing the Port

If you want to run the application on a different port:

1. Change the PORT value in your `.env` file
2. The server will use this port when starting

## Development Workflow

Here are some common development tasks:

### Frontend Development

The frontend code is located in the `client/src` directory.

- **Pages**: Found in `client/src/pages`
- **Components**: Found in `client/src/components`
- **Hooks**: Found in `client/src/hooks`
- **API Integration**: Uses `@tanstack/react-query` for data fetching

### Backend Development

The backend code is located in the `server` directory.

- **API Routes**: Defined in `server/routes.ts`
- **Database Operations**: Implemented in `server/storage.ts`
- **Authentication**: Configured in `server/auth.ts`

### Database Schema Changes

If you need to modify the database schema:

1. Update the models in `shared/schema.ts`
2. Run the migration command: `npm run db:push`

## Running Tests

Execute the test suite:

```bash
npm test
```

## Building for Production

To create a production build:

```bash
npm run build
```

This will compile the TypeScript files and bundle the React application.

## Common Issues and Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Verify that PostgreSQL is running
2. Check that your database credentials in `.env` are correct
3. Ensure the PostgreSQL port is not blocked by a firewall

### Port Conflicts

If you encounter a "port already in use" error:

1. Change the PORT value in your `.env` file
2. Kill any process using the port: `npx kill-port 3000`

### Node.js Version Issues

If you encounter compatibility issues with Node.js:

1. Use a Node.js version manager like [nvm](https://github.com/nvm-sh/nvm) to install the recommended version
2. Run `nvm use` to switch to the project's Node.js version

## Additional Tools

### Drizzle Studio

You can use Drizzle Studio to visually manage your database:

```bash
npm run db:studio
```

This will start Drizzle Studio on http://localhost:4000, where you can browse and modify your database tables.

### API Testing

For testing API endpoints, you can use tools like:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/) from the command line

## Project Structure Overview

```
medsync/
├── client/               # Frontend code
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Application pages
│   │   ├── App.tsx       # Main App component
│   │   └── main.tsx      # Entry point
│   └── index.html
├── server/               # Backend code
│   ├── auth.ts           # Authentication setup
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Vite development server config
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Database schema definition
├── docs/                 # Documentation
├── drizzle.config.ts     # Drizzle ORM configuration
└── package.json          # Project dependencies and scripts
```

## Next Steps

After setting up your local development environment, you might want to:

1. Familiarize yourself with the codebase
2. Check out the [Environment Variables Guide](./environment-variables.md) for more configuration options
3. Review the [Database Schema Overview](../database/schema.md) to understand the data structure
4. Explore the [API Endpoints Documentation](../api/endpoints.md) for backend integration