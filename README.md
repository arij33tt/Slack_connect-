# Slack Connect 🚀

A full-stack application that enables users to connect their Slack workspace, send messages immediately, and schedule messages for future delivery. Built with TypeScript, Node.js, React, and SQLite.

## 🌟 Features

- **Secure Slack OAuth 2.0 Integration**: Connect your Slack workspace safely
- **Immediate Messaging**: Send messages to any channel instantly
- **Scheduled Messaging**: Schedule messages for future delivery with precision
- **Message Management**: View, track, and cancel scheduled messages
- **Auto Token Refresh**: Automatic token renewal without user re-authentication
- **Real-time Updates**: Live status updates for scheduled messages
- **Responsive UI**: Clean, modern interface that works on all devices

## 🏗️ Architecture

### Backend (Node.js + TypeScript)
- **Express.js** for REST API
- **SQLite3** for data persistence
- **OAuth 2.0** with Slack Web API
- **Node-cron** for scheduled message processing
- **Automatic token refresh** mechanism

### Frontend (React + TypeScript)
- **React 18** with modern hooks
- **Axios** for API communication
- **React Toastify** for notifications
- **Responsive CSS** for mobile-first design

### Database Schema
- `users`: OAuth tokens and user data
- `scheduled_messages`: Message queue with status tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- A Slack workspace where you can install apps

### 1. Clone and Install
```bash
git clone <your-repository-url>
cd slack-connect
npm install
```

### 2. Set up Slack App
1. Go to [Slack API Console](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app and select your workspace
4. Go to "OAuth & Permissions":
   - Add Redirect URL: `https://your-domain.com/auth/callback` (or `http://localhost:3001/auth/callback` for local)
   - Add Bot Token Scopes:
     - `channels:read`
     - `chat:write`
     - `groups:read`
     - `im:read`
     - `mpim:read`
5. Go to "Basic Information" and copy:
   - Client ID
   - Client Secret
   - Signing Secret

### 3. Environment Setup

Create `packages/backend/.env` (minimal configuration needed):
```env
# Application URLs
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_PATH=./data/slack_connect.db

# Server
PORT=3001
NODE_ENV=development
```

**Note:** No Slack credentials needed in .env files! Users enter their credentials through the UI.

### 4. Run Development Server
```bash
# Install dependencies
npm install

# Start both frontend and backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📱 How to Use

### 1. Connect to Slack
1. Open the application
2. Click "Enter Slack App Credentials"
3. Fill in your Slack app Client ID and Client Secret
4. Click "Connect to Slack"
5. Authorize the app in your Slack workspace

### 2. Send Messages
- **Immediate**: Select channel, type message, click "🚀 Send Now"
- **Scheduled**: Select channel, type message, pick date/time, click "⏰ Schedule Message"

### 3. Manage Scheduled Messages
- View all scheduled messages in the dashboard
- Cancel pending messages before they're sent
- Track message status (Pending/Sent/Failed/Cancelled)

## 🚢 Deployment

### Railway Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/slack-connect.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [Railway](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will automatically detect the Dockerfile and deploy

3. **Set Environment Variables** in Railway dashboard:
   ```
   SLACK_CLIENT_ID=your_slack_client_id
   SLACK_CLIENT_SECRET=your_slack_client_secret
   SLACK_SIGNING_SECRET=your_slack_signing_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.up.railway.app
   BACKEND_URL=https://your-app-name.up.railway.app
   DATABASE_PATH=/app/data/slack_connect.db
   ```

4. **Update Slack App Settings**:
   - In Slack API Console, update Redirect URLs:
   - `https://your-app-name.up.railway.app/auth/callback`

### Alternative: Heroku Deployment

1. **Install Heroku CLI** and login
2. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set SLACK_CLIENT_ID=your_client_id
   heroku config:set SLACK_CLIENT_SECRET=your_client_secret
   heroku config:set SLACK_SIGNING_SECRET=your_signing_secret
   heroku config:set NODE_ENV=production
   ```
4. **Deploy**:
   ```bash
   git push heroku main
   ```

## 🛠️ Development

### Project Structure
```
slack-connect/
├── packages/
│   ├── backend/              # Node.js API server
│   │   ├── src/
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── services/     # Business logic
│   │   │   ├── database/     # Database setup
│   │   │   └── server.ts     # Express app
│   │   └── package.json
│   └── frontend/             # React application
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── services/     # API client
│       │   └── App.tsx       # Main app
│       └── package.json
├── Dockerfile               # Production deployment
├── railway.json            # Railway configuration
└── package.json            # Root workspace config
```

### Available Scripts
```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:backend      # Start only backend
npm run dev:frontend     # Start only frontend

# Production
npm run build           # Build both applications
npm start              # Start production server

# Backend only
cd packages/backend
npm run dev            # Development mode with hot reload
npm run build          # Compile TypeScript
npm start              # Start compiled server

# Frontend only
cd packages/frontend
npm run dev            # Development mode
npm run build          # Build for production
```

### API Endpoints

#### Authentication
- `GET /auth/slack` - Initiate Slack OAuth
- `GET /auth/callback` - Handle OAuth callback
- `GET /auth/user/:userId` - Get user info

#### Messages
- `POST /api/messages/send` - Send immediate message
- `GET /api/messages/channels/:userId` - Get user's channels

#### Scheduled Messages
- `POST /api/scheduled/schedule` - Schedule a message
- `GET /api/scheduled/list/:userId` - Get user's scheduled messages
- `DELETE /api/scheduled/cancel/:messageId` - Cancel scheduled message

## 🔧 Troubleshooting

### Common Issues

1. **OAuth Callback Error**
   - Ensure redirect URL in Slack app matches your deployment URL
   - Check that HTTPS is used in production

2. **Database Connection Issues**
   - Verify DATABASE_PATH environment variable
   - Ensure write permissions for database directory

3. **Build Failures**
   - Check that all environment variables are set
   - Verify Node.js version compatibility (v16+)

4. **Scheduled Messages Not Sending**
   - Check server logs for cron job errors
   - Verify token hasn't expired (auto-refresh should handle this)

### Development Tips

- Use browser dev tools to inspect network requests
- Check backend logs for API errors
- Test OAuth flow in incognito mode
- Use Slack's API tester for debugging token issues

## 🔐 Security Features

- **Encrypted token storage** in SQLite database
- **Automatic token refresh** prevents expired sessions
- **CORS protection** for cross-origin requests
- **Environment variable** configuration for secrets
- **Input validation** on all API endpoints

## 📈 Monitoring

The application includes:
- Health check endpoint (`/health`)
- Comprehensive error logging
- Database connection monitoring
- Scheduled job execution tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs for error messages
3. Create an issue on GitHub with:
   - Error description
   - Steps to reproduce
   - Environment details
   - Log excerpts (without sensitive data)

---

**Built with ❤️ using TypeScript, React, and Node.js**
