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
