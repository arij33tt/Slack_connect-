# Slack Connect

A full-stack application that enables users to connect their Slack workspace, send immediate messages, and schedule messages for future delivery.

## 🚀 Features

- **Slack OAuth 2.0 Integration**: Secure connection to Slack workspaces
- **Immediate Messaging**: Send messages instantly to channels and DMs
- **Message Scheduling**: Schedule messages for specific future dates and times
- **Message Management**: View, track, and cancel scheduled messages
- **Automatic Token Refresh**: Seamless token management for continuous service
- **Real-time Status Updates**: Live status tracking of scheduled messages

## 🏗 Architecture

### Backend (Node.js + TypeScript)
- **Express.js** server with TypeScript
- **SQLite** database for storing user tokens and scheduled messages
- **Slack Web API** integration for messaging
- **OAuth 2.0** flow implementation with state verification
- **Cron-based scheduler** for message delivery
- **CORS** configured for cross-origin requests

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Responsive design** with custom CSS
- **Toast notifications** for user feedback
- **Real-time updates** for message status
- **Mobile-friendly** interface

### Key Components
1. **OAuth Handler**: Manages Slack authentication flow
2. **Message Service**: Handles immediate message sending
3. **Scheduler Service**: Processes and sends scheduled messages
4. **Database Layer**: SQLite with proper schema design
5. **Frontend Components**: Auth, Dashboard, MessageForm, ScheduledMessages

## 🛠 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Slack app (we'll create this)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd slack-connect
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Enter app name: "Slack Connect"
4. Choose your development workspace
5. Click "Create App"

### 4. Configure Slack App

#### OAuth & Permissions:
1. Go to "OAuth & Permissions" in the left sidebar
2. Add these **Bot Token Scopes**:
   - `channels:read`
   - `chat:write`
   - `groups:read`
   - `im:read`
   - `mpim:read`
   - `users:read`

3. Add **Redirect URLs**:
   - For local development: `http://localhost:3001/auth/slack/callback`
   - For production: `https://your-backend-domain.com/auth/slack/callback`

#### App Settings:
1. Go to "Basic Information"
2. Copy the **Client ID** and **Client Secret**

### 5. Environment Configuration

#### Backend Environment:
Create `packages/backend/.env`:
```env
# Slack OAuth Configuration
SLACK_CLIENT_ID=your_slack_client_id_here
SLACK_CLIENT_SECRET=your_slack_client_secret_here
SLACK_REDIRECT_URI=http://localhost:3001/auth/slack/callback

# Frontend URL (for CORS and redirects)
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Frontend Environment:
Create `packages/frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 6. Run the Application

#### Development Mode:
```bash
# Start both backend and frontend
npm run dev

# Or start individually:
npm run dev:backend  # Backend only (port 3001)
npm run dev:frontend # Frontend only (port 3000)
```

#### Production Build:
```bash
npm run build
npm start
```

### 7. Test the Application

1. Open http://localhost:3000
2. Click "Connect to Slack"
3. Authorize the app in Slack
4. Start sending immediate and scheduled messages!

## 🌐 Deployment

### Backend Deployment (Railway/Render)

#### Option 1: Railway (Recommended)
1. Create account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Configure environment variables in Railway dashboard
4. Deploy automatically from main branch

#### Option 2: Render
1. Create account at [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run build --workspace=backend`
5. Set start command: `npm start --workspace=backend`
6. Configure environment variables

### Frontend Deployment (Vercel)

#### Option 1: Vercel (Recommended)
1. Create account at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Framework: Create React App
   - Root Directory: `packages/frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Set environment variables:
   - `REACT_APP_API_URL`: Your backend URL

#### Option 2: Netlify
1. Create account at [Netlify](https://netlify.com)
2. Drag and drop `packages/frontend/build` folder
3. Configure environment variables

### Environment Variables for Production

#### Backend:
```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_REDIRECT_URI=https://your-backend-domain.com/auth/slack/callback
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
PORT=3001
```

#### Frontend:
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

### Update Slack App Settings

After deployment, update your Slack app:
1. Go to "OAuth & Permissions"
2. Update Redirect URLs to include production URL
3. Update any other relevant settings

## 🔧 Configuration

### Database
- Uses SQLite for simplicity and deployment compatibility
- Database file stored in `/tmp/` in production (ephemeral storage)
- For persistent storage, consider PostgreSQL or MongoDB

### CORS
- Configured to allow requests from frontend domain
- Credentials enabled for cookie-based sessions
- Adjustable in `server.ts`

### Rate Limiting
- Consider implementing rate limiting for production
- Slack API has rate limits (Tier 2: 50+ requests per minute)

## 🚨 Troubleshooting

### Common Issues

#### OAuth Callback Errors:
- Ensure redirect URI matches exactly in Slack app settings
- Check that backend URL is accessible and using HTTPS in production

#### CORS Errors:
- Verify FRONTEND_URL environment variable
- Ensure both domains use HTTPS in production

#### Database Errors:
- Check write permissions for database file location
- Ensure SQLite is properly installed

#### Message Sending Failures:
- Verify bot has proper permissions in Slack channels
- Check Slack API rate limits
- Ensure tokens are not expired

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed error logging
- API request logging
- Database file in local directory

## 📚 API Documentation

### Authentication Endpoints
- `GET /auth/slack` - Initiate OAuth flow
- `GET /auth/slack/callback` - Handle OAuth callback
- `GET /auth/status/:userId` - Check authentication status

### Message Endpoints
- `GET /api/messages/channels/:userId` - Get user's channels
- `POST /api/messages/send` - Send immediate message

### Scheduled Message Endpoints
- `POST /api/scheduled/schedule` - Schedule a message
- `GET /api/scheduled/list/:userId` - Get scheduled messages
- `DELETE /api/scheduled/cancel/:messageId` - Cancel scheduled message

## 🔒 Security Considerations

- OAuth state parameter prevents CSRF attacks
- Tokens stored securely in database
- Environment variables for sensitive configuration
- HTTPS required for production OAuth
- Input validation on all endpoints

## 📈 Future Enhancements

- [ ] Message templates and rich text formatting
- [ ] Recurring scheduled messages
- [ ] Message analytics and delivery reports
- [ ] Multi-workspace support
- [ ] Team collaboration features
- [ ] Message threading support
- [ ] File attachment support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review Slack app configuration
3. Verify environment variables
4. Check browser console for errors
5. Review server logs for backend issues

---

**Built with ❤️ for seamless Slack messaging automation**
