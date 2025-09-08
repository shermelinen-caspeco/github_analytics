# Caspeco GitHub Analytics

A full-stack Node.js application with React frontend for analyzing GitHub organization data. This application provides comprehensive insights into the Caspeco organization's repositories and team members.

## Features

- **Repository Analytics**: View all organization repositories with detailed metrics
- **Team Overview**: Browse organization members with profile information  
- **Real-time Data**: Fetch latest data from GitHub API with authentication
- **Persistent Storage**: PostgreSQL database for efficient data retrieval
- **Responsive UI**: Clean, tabbed interface built with React

## Architecture

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **GitHub API** integration using Octokit
- **Docker Compose** for database containerization

### Frontend  
- **React** with functional components and hooks
- **Responsive grid layouts** for data display
- **Tabbed navigation** between repositories and members
- **Direct GitHub profile/repository links**

## Quick Start

### Prerequisites
- Node.js (v14+)
- Docker and Docker Compose
- GitHub Personal Access Token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github_analytics
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

6. **Start the application**
   ```bash
   # Terminal 1: Backend server
   npm start

   # Terminal 2: React frontend  
   cd client
   npm start
   ```

## Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3001

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=github_analytics_db
DB_USER=github_analytics_user
DB_PASSWORD=github_analytics_password

# GitHub API configuration
GITHUB_TOKEN=your_github_personal_access_token
```

### GitHub Token Setup
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Create a new token with `repo` and `read:org` permissions
3. Add the token to your `.env` file

## API Endpoints

### Repositories
- `GET /api/github/organizations/:org/repositories?sync=true` - Fetch and sync repositories
- `GET /api/github/repositories` - Get stored repositories with filtering

### Users  
- `GET /api/github/organizations/:org/members?sync=true` - Fetch and sync members
- `GET /api/github/users` - Get stored users with filtering

### Analytics
- `POST /api/analytics/events` - Create analytics event
- `GET /api/analytics/events` - Get analytics events

## Database Schema

### Repositories Table
Stores comprehensive repository metadata including stars, forks, languages, topics, and GitHub timestamps.

### Users Table
Contains organization member information with profile data, avatars, and GitHub API URLs.

### Analytics Events Table
Tracks user interactions and system events for monitoring and analysis.

## Development

### Running Tests
```bash
npm test
```

### Database Operations
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# View logs
docker-compose logs postgres
```

### Syncing Data
Visit the application and it will automatically sync data, or call the API endpoints directly:

```bash
# Sync repositories
curl "http://localhost:3001/api/github/organizations/caspeco/repositories?sync=true"

# Sync members
curl "http://localhost:3001/api/github/organizations/caspeco/members?sync=true"
```

## Deployment

The application is ready for production deployment with:
- Environment-based configuration
- Database migrations via Sequelize
- Static file serving for React build
- Error handling and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is proprietary software owned by Caspeco.