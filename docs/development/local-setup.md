# Local Development Setup Guide for MedSync

This guide provides detailed instructions for setting up the MedSync application for local development.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

1. **Node.js** (v16 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Or use a version manager like [nvm](https://github.com/nvm-sh/nvm)

2. **PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use a Docker container (instructions below)

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/downloads)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/medsync.git
cd medsync
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all the required dependencies for both the frontend and backend.

## Step 3: Set Up PostgreSQL Database

### Option 1: Using a Local PostgreSQL Installation

1. Create a new PostgreSQL database:
   ```bash
   psql -U postgres
   CREATE DATABASE medsync;
   \q
   ```

2. Configure the database connection by creating a `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/medsync
   SESSION_SECRET=your_development_session_secret
   ```

### Option 2: Using Docker for PostgreSQL

1. If you have Docker installed, you can run PostgreSQL in a container:
   ```bash
   docker run --name medsync-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=medsync -p 5432:5432 -d postgres:15-alpine
   ```

2. Configure the database connection in your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medsync
   SESSION_SECRET=your_development_session_secret
   ```

### Option 3: Using Docker Compose

1. If you prefer using Docker Compose, you can use the provided `docker-compose.yml` file:
   ```bash
   docker-compose up -d postgres
   ```

2. Configure the database connection in your `.env` file:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medsync
   SESSION_SECRET=your_development_session_secret
   ```

## Step 4: Initialize the Database Schema

Run the database schema push command to create all the necessary tables and indexes:

```bash
npm run db:push
```

This command uses Drizzle ORM to push your schema definition from `shared/schema.ts` to your PostgreSQL database.

## Step 5: Start the Development Server

Start the development server:

```bash
npm run dev
```

This will start both the Express backend server and the Vite frontend development server.

- The frontend will be available at: [http://localhost:3000](http://localhost:3000)
- The backend API will be available at: [http://localhost:3000/api](http://localhost:3000/api)

## Step 6: Create a Test User (Optional)

For testing purposes, you can create a test user by accessing the application and registering a new user at [http://localhost:3000/auth](http://localhost:3000/auth).

## Project Structure

Here's an overview of the MedSync project structure:

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
└── drizzle.config.ts       # Drizzle ORM configuration
```

## Development Workflow

### Frontend Development

The frontend is built using React and is located in the `client/` directory. Key technologies:

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast development server and bundler
- **TanStack Query**: Data fetching and state management
- **Shadcn/UI**: Component library
- **TailwindCSS**: Utility-first CSS framework
- **Wouter**: Lightweight routing library

### Backend Development

The backend is built using Express and is located in the `server/` directory. Key technologies:

- **Express**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **Drizzle ORM**: Database ORM for PostgreSQL
- **Passport.js**: Authentication middleware
- **Zod**: Schema validation

### Database Schema Development

The database schema is defined in `shared/schema.ts` and is used by both the frontend and backend. When you make changes to the schema:

1. Update the schema definition in `shared/schema.ts`
2. Run `npm run db:push` to apply the changes to your database

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the frontend and backend for production
- `npm run start`: Start the production server
- `npm run db:push`: Push the schema to the database
- `npm run db:generate`: Generate migration files
- `npm run db:studio`: Open Drizzle Studio to interact with the database

## Using the Application

Once the development server is running, you can:

1. Access the application at [http://localhost:3000](http://localhost:3000)
2. Register a new user account or log in with existing credentials
3. Explore the different features of the MedSync application

## Debugging

### Backend Debugging

To debug the backend, you can:

1. Add `console.log` statements in your code
2. Use the Node.js debugger:
   - Add a `debugger` statement in your code
   - Start the server with `node --inspect server/index.js`
   - Open Chrome and navigate to `chrome://inspect`

### Frontend Debugging

To debug the frontend, you can:

1. Use the React Developer Tools browser extension
2. Use the browser's built-in developer tools (F12 or right-click and select "Inspect")
3. Add `console.log` statements in your code

## Working with the Database

### Viewing Database Content

You can use Drizzle Studio to view and manipulate your database:

```bash
npm run db:studio
```

This will open a web interface where you can explore your database tables, run queries, and more.

### Database Migrations

For more control over database changes, you can use Drizzle's migration system:

1. Generate migration files:
   ```bash
   npm run db:generate
   ```

2. Apply migrations:
   ```bash
   npm run db:migrate
   ```

## Testing

### Running Tests

To run tests:

```bash
npm test
```

This will run tests for both the frontend and backend.

### Writing Tests

- Backend tests are located in `server/__tests__/`
- Frontend tests are located in `client/src/__tests__/`

## Code Style and Linting

The project uses ESLint and Prettier for code style and linting:

- Run linting:
  ```bash
  npm run lint
  ```

- Fix linting issues:
  ```bash
  npm run lint:fix
  ```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check that PostgreSQL is running
2. Verify your database credentials in the `.env` file
3. Make sure the database name is correct

### Node.js Version Issues

If you're experiencing issues with Node.js:

1. Make sure you're using Node.js version 16 or higher
2. Try clearing the Node.js cache:
   ```bash
   npm cache clean --force
   ```

### Port Conflicts

If port 3000 is already in use:

1. You can change the port in your `.env` file:
   ```
   PORT=3001
   ```

2. Or kill the process using port 3000:
   ```bash
   npx kill-port 3000
   ```

## Next Steps

After setting up your local development environment:

1. Explore the [API Documentation](/docs/api/endpoints.md) to understand the available endpoints
2. Learn about the [Database Schema](/docs/database/schema.md) to understand the data model
3. Review the [Environment Variables Guide](/docs/development/environment-variables.md) for configuration options

## Conclusion

You should now have a fully functional local development environment for the MedSync application. Happy coding!