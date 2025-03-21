# Docker Deployment Guide for MedSync

This guide provides instructions for deploying the MedSync application using Docker and Docker Compose.

## Prerequisites

Before deploying with Docker, ensure you have:

1. [Docker](https://docs.docker.com/get-docker/) installed on your server
2. [Docker Compose](https://docs.docker.com/compose/install/) installed on your server
3. Basic understanding of Docker concepts
4. A PostgreSQL database (either Docker container or external service)

## Development Environment Setup

MedSync includes a development Docker setup that makes it easy to get started without installing Node.js or PostgreSQL locally.

### Using Docker Compose for Development

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/yourusername/medsync.git
   cd medsync
   ```

2. Start the development environment:
   ```bash
   docker-compose up
   ```

3. The application will be available at `http://localhost:3000`

4. The PostgreSQL database will be available at:
   - Host: `localhost`
   - Port: `5432`
   - User: `postgres`
   - Password: `postgres`
   - Database: `medsync`

### Development Environment Features

- Hot reloading enabled for both frontend and backend code
- PostgreSQL database with persistent volume
- Automatic dependency installation
- Environment variables preconfigured for development

## Production Deployment with Docker

For production deployments, we recommend using the production Dockerfile.

### Building the Production Docker Image

1. Build the Docker image:
   ```bash
   docker build -t medsync:latest .
   ```

2. Run the Docker container:
   ```bash
   docker run -d \
     --name medsync \
     -p 3000:3000 \
     -e DATABASE_URL=postgresql://username:password@host:port/database \
     -e SESSION_SECRET=your_secure_session_secret \
     medsync:latest
   ```

3. The application will be available at `http://localhost:3000` (or your server's IP/domain)

### Environment Variables for Production

Configure these environment variables when running the container:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:password@host:port/database` |
| `SESSION_SECRET` | Secret for session encryption | Yes | `a-secure-random-string` |
| `PORT` | Port to run the server on | No (default: 3000) | `3000` |
| `NODE_ENV` | Environment mode | No (default: production) | `production` |

## Production Deployment with Docker Compose

For a complete production stack with both the application and database:

1. Create a `docker-compose.prod.yml` file:
   ```yaml
   version: '3.8'
   services:
     postgres:
       image: postgres:15-alpine
       container_name: medsync_postgres_prod
       environment:
         POSTGRES_USER: ${POSTGRES_USER:-postgres}
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-strongpassword}
         POSTGRES_DB: ${POSTGRES_DB:-medsync}
       volumes:
         - postgres_data:/var/lib/postgresql/data
       restart: unless-stopped
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U postgres"]
         interval: 10s
         timeout: 5s
         retries: 5
       networks:
         - medsync_network
     
     app:
       build:
         context: .
         dockerfile: Dockerfile
       container_name: medsync_app_prod
       depends_on:
         postgres:
           condition: service_healthy
       environment:
         - NODE_ENV=production
         - PORT=3000
         - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-strongpassword}@postgres:5432/${POSTGRES_DB:-medsync}
         - SESSION_SECRET=${SESSION_SECRET:-changeme}
       ports:
         - "${PORT:-3000}:3000"
       restart: unless-stopped
       networks:
         - medsync_network
   
   volumes:
     postgres_data:
       name: medsync_postgres_data_prod
   
   networks:
     medsync_network:
       name: medsync_network
   ```

2. Create a `.env` file for environment variables:
   ```
   # PostgreSQL Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=yoursecurepassword
   POSTGRES_DB=medsync
   
   # Application Configuration
   PORT=3000
   SESSION_SECRET=yoursupersecuresessionsecret
   ```

3. Start the production stack:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. Initialize the database schema:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npm run db:push
   ```

5. The application will be available at `http://localhost:3000` (or your server's IP/domain)

## Securing the Production Deployment

For a secure production deployment, consider these additional steps:

1. **Add HTTPS**: Use a reverse proxy like Nginx with Let's Encrypt for SSL/TLS
2. **Limit access**: Configure firewalls to limit access to your Docker host
3. **Use Docker secrets**: For sensitive information like database passwords
4. **Regular updates**: Keep your Docker images and containers updated
5. **Database backups**: Implement regular backup procedures for the PostgreSQL volume

## Docker Deployment with Nginx

For a production setup with Nginx as a reverse proxy:

1. Create an `nginx.conf` file:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           return 301 https://$host$request_uri;
       }
   }
   
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;
       
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_prefer_server_ciphers on;
       ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
       
       location / {
           proxy_pass http://app:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. Add Nginx to your `docker-compose.prod.yml`:
   ```yaml
   nginx:
     image: nginx:alpine
     container_name: medsync_nginx
     ports:
       - "80:80"
       - "443:443"
     volumes:
       - ./nginx.conf:/etc/nginx/conf.d/default.conf
       - ./ssl:/etc/nginx/ssl
     depends_on:
       - app
     restart: unless-stopped
     networks:
       - medsync_network
   ```

3. Generate SSL certificates or use Let's Encrypt

4. Start the stack with Nginx:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Troubleshooting Docker Deployments

### Container Won't Start

If the container fails to start:

1. Check the container logs:
   ```bash
   docker logs medsync
   ```

2. Verify environment variables are set correctly
3. Ensure the database is accessible from the container

### Database Connection Issues

If the application can't connect to the database:

1. Check the DATABASE_URL environment variable
2. Verify the PostgreSQL container is running and healthy
3. Ensure the network between containers is working

### Performance Issues

If the application is slow:

1. Check container resource usage:
   ```bash
   docker stats
   ```

2. Consider allocating more resources to the containers
3. Optimize the PostgreSQL configuration for your workload

## Updating the Application

To update to a new version:

1. Pull the latest code:
   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. Run any database migrations:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npm run db:push
   ```

## Conclusion

Your MedSync application should now be successfully containerized and deployed using Docker. This setup provides a scalable, reproducible environment that can be easily deployed to any Docker-compatible hosting service.

## Next Steps

- [Set up monitoring with Prometheus and Grafana](https://prometheus.io/docs/guides/dockerize/)
- [Implement container orchestration with Kubernetes](https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/)
- [Automate deployments with CI/CD](https://docs.github.com/en/actions/guides/about-continuous-deployment)