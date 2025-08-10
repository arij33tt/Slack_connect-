# Quick Setup Guide

## Prerequisites
Make sure you have Node.js (v16+) installed on your system.

## 1. Install Dependencies
```bash
npm install
```

## 2. Create Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Enter app name: "Slack Connect"
4. Choose your workspace
5. Go to "OAuth & Permissions"
6. Add these Bot Token Scopes:
   - `channels:read`
   - `chat:write`
   - `groups:read`
   - `im:read`
   - `mpim:read`
   - `users:read`
7. Add Redirect URL: `http://localhost:3001/auth/slack/callback`
8. Copy Client ID and Client Secret from "Basic Information"

## 3. Environment Setup

Create `packages/backend/.env`:
```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_REDIRECT_URI=http://localhost:3001/auth/slack/callback
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

Create `packages/frontend/.env` (optional):
```env
REACT_APP_API_URL=http://localhost:3001
```

## 4. Run the Application
```bash
npm run dev
```

This starts both frontend (http://localhost:3000) and backend (http://localhost:3001).

## 5. Test
1. Open http://localhost:3000
2. Click "Connect to Slack"
3. Authorize the app
4. Start messaging!

## Common Issues

**"Missing Slack OAuth configuration"**
- Check that .env file exists in packages/backend/
- Verify SLACK_CLIENT_ID and SLACK_CLIENT_SECRET are set

**"OAuth callback failed"**
- Ensure redirect URI matches exactly in Slack app settings
- Check that backend is running on port 3001

**CORS errors**
- Verify FRONTEND_URL is set correctly in backend .env

## Production Deployment
See the main README.md for detailed deployment instructions.
