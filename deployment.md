# 🚀 Deployment Guide

This guide will help you deploy the Slack Connect application to Railway (recommended) or other platforms.

## ✅ Pre-deployment Checklist

1. **Code is ready**: All ESLint warnings fixed, builds successfully
2. **Slack App configured**: OAuth scopes and redirect URLs set up
3. **Environment variables**: All required variables identified
4. **Database**: SQLite configured for production use

## 🚂 Railway Deployment (Recommended)

Railway is recommended because it:
- Supports monorepo deployments
- Automatically detects Dockerfiles
- Provides HTTPS by default
- Has generous free tier
- Simple environment variable management

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial Slack Connect deployment"

# Create GitHub repository and push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/slack-connect.git
git push -u origin main
```

### Step 2: Deploy on Railway

1. **Sign up/Login**: Go to [Railway](https://railway.app) and sign in with GitHub
2. **Create Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your `slack-connect` repository
4. **Auto-deploy**: Railway will automatically detect the Dockerfile and start building

### Step 3: Configure Environment Variables

In the Railway dashboard, go to your project → Variables tab and add:

```
SLACK_CLIENT_ID=your_actual_slack_client_id
SLACK_CLIENT_SECRET=your_actual_slack_client_secret  
SLACK_SIGNING_SECRET=your_actual_slack_signing_secret
NODE_ENV=production
FRONTEND_URL=https://your-app-name.up.railway.app
BACKEND_URL=https://your-app-name.up.railway.app
DATABASE_PATH=/app/data/slack_connect.db
PORT=3001
```

**Note**: Replace `your-app-name` with your actual Railway app URL.

### Step 4: Update Slack App Settings

1. Go to [Slack API Console](https://api.slack.com/apps)
2. Select your app
3. Go to "OAuth & Permissions"
4. Update Redirect URLs to include: `https://your-app-name.up.railway.app/auth/callback`
5. Save changes

### Step 5: Test Deployment

1. Visit your Railway app URL
2. Test the OAuth flow
3. Try sending immediate and scheduled messages
4. Check logs in Railway dashboard for any issues

## 🔄 Alternative Platforms

### Heroku

1. **Install Heroku CLI** and login
2. **Create app**: `heroku create your-app-name`
3. **Set environment variables**:
   ```bash
   heroku config:set SLACK_CLIENT_ID=your_id
   heroku config:set SLACK_CLIENT_SECRET=your_secret
   heroku config:set SLACK_SIGNING_SECRET=your_signing_secret
   heroku config:set NODE_ENV=production
   ```
4. **Deploy**: `git push heroku main`

### Render

1. Create account at [Render](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Configure environment variables

## 📊 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------||
| `SLACK_CLIENT_ID` | OAuth Client ID from Slack app | `123456789.123456789` |
| `SLACK_CLIENT_SECRET` | OAuth Client Secret from Slack app | `abcd1234efgh5678...` |
| `SLACK_SIGNING_SECRET` | Signing Secret from Slack app | `abcd1234efgh5678...` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend domain (for CORS) | `https://your-app.railway.app` |
| `BACKEND_URL` | Backend domain | `https://your-app.railway.app` |
| `DATABASE_PATH` | SQLite database file location | `/app/data/slack_connect.db` |
| `PORT` | Server port | `3001` |

## 🔧 Troubleshooting Deployment

### Build Issues

**Problem**: Build fails with "npm run build" errors
**Solution**: 
- Check that ESLint warnings are fixed
- Ensure all dependencies are in package.json
- Verify TypeScript compiles without errors

### OAuth Redirect Issues

**Problem**: "redirect_uri_mismatch" error
**Solution**:
- Ensure Slack app redirect URL exactly matches deployed URL
- Check HTTPS is used in production
- Verify no trailing slashes in URLs

### Database Issues

**Problem**: SQLite database errors in production
**Solution**:
- Check DATABASE_PATH environment variable
- Ensure directory exists and has write permissions
- Consider using Railway's PostgreSQL addon for persistence

### Environment Variable Issues

**Problem**: App behavior differs from local development
**Solution**:
- Double-check all environment variables are set correctly
- Verify no extra spaces or quotes in values
- Use Railway logs to debug missing variables

## 📝 Production Checklist

- [ ] Code builds successfully locally
- [ ] All environment variables configured
- [ ] Slack app redirect URLs updated
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Database configured and accessible
- [ ] Logs show successful startup
- [ ] OAuth flow works end-to-end
- [ ] Message sending functionality tested
- [ ] Scheduled messages working
- [ ] Error handling verified

## 🚨 Security Notes

- Never commit `.env` files to git
- Use strong, unique secrets for production
- Regularly rotate Slack app credentials
- Monitor application logs for security issues
- Consider rate limiting for production use

## 📈 Monitoring

### Railway Dashboard
- View deployment logs
- Monitor resource usage
- Set up alerts for failures
- Track performance metrics

### Recommended Monitoring
- Set up health check endpoints
- Monitor database performance
- Track Slack API usage
- Log error rates and patterns

## 🔄 Updates and Maintenance

### Deploying Updates
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Railway auto-deploys from main branch
5. Monitor deployment in Railway dashboard

### Database Maintenance
- SQLite files are ephemeral on Railway
- For persistent data, consider upgrading to PostgreSQL
- Backup important data regularly

---

Need help? Check the main README.md or create an issue on GitHub!

# Deployment Guide

This guide covers deploying your Slack Connect app to free/low-cost hosting services.

## Backend Deployment Options

### Railway (Recommended - Easy & Free)

1. **Sign up at [Railway](https://railway.app)**
2. **Connect GitHub**: Link your repository
3. **Create Service**: 
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set Root Directory: `packages/backend`
4. **Environment Variables**:
   ```
   SLACK_CLIENT_ID=your_client_id
   SLACK_CLIENT_SECRET=your_client_secret
   SLACK_REDIRECT_URI=https://your-backend-domain.up.railway.app/auth/slack/callback
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```
5. **Deploy**: Railway auto-deploys on git push

### Render (Alternative)

1. **Sign up at [Render](https://render.com)**
2. **New Web Service**: Connect GitHub repository
3. **Settings**:
   - Root Directory: `packages/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Environment Variables**: Same as Railway
5. **Deploy**: Manual deployment

### Heroku (If available)

```bash
# In packages/backend directory
heroku create your-app-name
heroku config:set SLACK_CLIENT_ID=your_client_id
heroku config:set SLACK_CLIENT_SECRET=your_client_secret
heroku config:set SLACK_REDIRECT_URI=https://your-app-name.herokuapp.com/auth/slack/callback
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
heroku config:set NODE_ENV=production
git push heroku main
```

## Frontend Deployment Options

### Vercel (Recommended - Easy & Free)

1. **Sign up at [Vercel](https://vercel.com)**
2. **Import Project**: Connect GitHub repository
3. **Configure Project**:
   - Framework: Create React App
   - Root Directory: `packages/frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-domain.up.railway.app
   ```
5. **Deploy**: Auto-deploys on git push

### Netlify (Alternative)

1. **Build locally**: `npm run build --workspace=frontend`
2. **Sign up at [Netlify](https://netlify.com)**
3. **Deploy**: Drag `packages/frontend/build` folder to Netlify
4. **Environment Variables**: Set REACT_APP_API_URL
5. **Custom Domain** (optional): Add your domain

## Database Considerations

### SQLite (Current - Simple)
- ✅ Works great for small-medium usage
- ✅ No additional setup required
- ❌ Data may be ephemeral on some platforms

### PostgreSQL (Upgrade Option)
If you need persistent data:

1. **Free PostgreSQL**:
   - Railway provides free PostgreSQL
   - Supabase offers free tier
   - Neon has generous free tier

2. **Update connection** in `packages/backend/src/database/init.ts`

## Update Slack App Settings

After deployment:

1. Go to your Slack app settings
2. **OAuth & Permissions**:
   - Update Redirect URL to production backend URL
   - Example: `https://your-app.up.railway.app/auth/slack/callback`
3. **App Settings**: Update any other URLs if needed

## Environment Variables Summary

### Backend (.env)
```env
SLACK_CLIENT_ID=1234567890.1234567890
SLACK_CLIENT_SECRET=abcdef123456...
SLACK_REDIRECT_URI=https://your-backend.up.railway.app/auth/slack/callback
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.up.railway.app
```

## SSL/HTTPS Requirements

⚠️ **Important**: Slack OAuth requires HTTPS in production.

- ✅ Railway provides HTTPS automatically
- ✅ Vercel provides HTTPS automatically
- ✅ Render provides HTTPS automatically
- ❌ Local development uses HTTP (okay for testing)

## Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Built-in monitoring

### Render
- Logs available in dashboard
- Basic metrics included

### Debugging
- Check browser console for frontend errors
- Check platform logs for backend errors
- Verify environment variables are set

## Custom Domains (Optional)

### Railway
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records

### Vercel
1. Project Settings → Domains
2. Add custom domain
3. Configure DNS

## Security Checklist

- [ ] Environment variables set correctly
- [ ] Slack redirect URI matches exactly
- [ ] HTTPS enabled for production
- [ ] CORS configured for your frontend domain
- [ ] Client secrets not exposed in frontend

## Cost Estimates (Monthly)

- **Free Tier**: Railway + Vercel = $0
- **Light Usage**: ~$5-10 with paid tiers
- **Medium Usage**: ~$20-30 with PostgreSQL

## Troubleshooting

**"OAuth callback failed"**
- Check redirect URI matches exactly
- Ensure backend is accessible via HTTPS

**"CORS error"**
- Verify FRONTEND_URL environment variable
- Check your domain is correct

**"App crashes on startup"**
- Check platform logs
- Verify all environment variables are set
- Ensure build completed successfully

**Database errors**
- Check write permissions
- Consider upgrading to PostgreSQL for persistence

---

Need help? Check the troubleshooting section in the main README.md
