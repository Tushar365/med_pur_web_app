# Contributing to MedSync

Thank you for your interest in contributing to MedSync! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers understand your report, reproduce the issue, and find related reports.

- Use the bug report template when creating an issue
- Include detailed steps to reproduce the problem
- Describe the behavior you observed and what you expected to see
- Include screenshots if possible
- Specify your environment (OS, browser, version of MedSync)

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use the feature request template when creating an issue
- Provide a clear and detailed explanation of the feature
- Explain why this enhancement would be useful to most MedSync users
- Include mockups or diagrams if applicable

### Pull Requests

- Fill in the required template
- Follow the coding style and conventions
- Include appropriate tests
- Update documentation for any changed functionality
- Ensure all tests pass before submitting

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v12 or higher)

### Local Development

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/medsync.git`
3. Install dependencies: `npm install`
4. Set up your environment variables (see docs/development/environment-variables.md)
5. Start the development server: `npm run dev`

### Database Setup

1. Create a PostgreSQL database for development
2. Set the DATABASE_URL environment variable to point to your database
3. Run migrations: `npm run db:push`

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or fewer
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Styleguide

- Use TypeScript for all new code
- Follow the ESLint configuration in the project
- Document all functions and complex code sections
- Use meaningful variable names
- Keep functions small and focused on a single responsibility

### React Component Styleguide

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Use Shadcn UI components where applicable
- Follow the component folder structure established in the project

### CSS/Styling Styleguide

- Use Tailwind CSS for styling
- Follow the BEM naming convention for any custom CSS
- Maintain a consistent color scheme using theme variables

### Documentation Styleguide

- Use Markdown for documentation
- Update documentation when you change code
- Document complex algorithms or business logic in code comments

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

- `bug`: Something isn't working
- `documentation`: Improvements or additions to documentation
- `enhancement`: New feature or request
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

Thank you for contributing to MedSync!