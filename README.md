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
git clone <repository-url>
cd slack-connect
npm install
```

### 2. Set up Slack App
1. Go to [Slack API Console](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Name your app and select your workspace
4. Go to "OAuth & Permissions":
   - Add Redirect URL: `https://website-domain.com/auth/callback` (or `http://localhost:3001/auth/callback` for local)
   - Add Bot Token Scopes:
     - `channels:read`
     - `chat:write`
     - `groups:read`
     - `im:read`
     - `mpim:read`
5. Go to "Basic Information" and copy:
   - Client ID
   - Client Secret

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


---

**Built with ❤️ using TypeScript, React, and Node.js**
