import express from 'express';
import axios from 'axios';
import { getDatabase, dbRun, dbGet } from '../database/init';
import crypto from 'crypto';

const router = express.Router();

// Generate OAuth state parameter for security
const generateState = () => crypto.randomBytes(32).toString('hex');

// Store state temporarily (in production, use Redis or similar)
const oauthStates = new Map<string, { timestamp: number; credentials: any }>();

// Slack OAuth URLs
const SLACK_OAUTH_URL = 'https://slack.com/oauth/v2/authorize';
const SLACK_TOKEN_URL = 'https://slack.com/api/oauth.v2.access';

// Start OAuth flow with dynamic credentials
router.post('/slack', (req, res) => {
  console.log('OAuth flow initiated with:', {
    hasClientId: !!req.body.clientId,
    hasClientSecret: !!req.body.clientSecret,
    hasSigningSecret: !!req.body.signingSecret
  });
  
  const { clientId, clientSecret, signingSecret } = req.body;
  
  if (!clientId || !clientSecret) {
    console.log('Missing credentials error');
    return res.status(400).json({ 
      error: 'Missing required Slack credentials. Please provide clientId and clientSecret.' 
    });
  }

  // Use environment variable for redirect URI or construct from request
  const redirectUri = process.env.SLACK_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/slack/callback`;

  const state = generateState();
  
  // Store credentials with state for callback
  oauthStates.set(state, {
    timestamp: Date.now(),
    credentials: { clientId, clientSecret, signingSecret }
  });
  
  // Clean up old states (older than 10 minutes)
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, data] of oauthStates.entries()) {
    if (data.timestamp < tenMinutesAgo) {
      oauthStates.delete(key);
    }
  }

  const scopes = [
    'channels:read',
    'chat:write',
    'groups:read',
    'im:read',
    'mpim:read',
    'users:read'
  ].join(',');

  const authUrl = `${SLACK_OAUTH_URL}?` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}&` +
    `response_type=code`;

  res.json({ authUrl });
});

// Handle OAuth callback
router.get('/slack/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=${encodeURIComponent(error as string)}`);
  }

  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=missing_code_or_state`);
  }

  // Verify state parameter and get credentials
  const stateData = oauthStates.get(state as string);
  if (!stateData) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=invalid_state`);
  }
  
  const { credentials } = stateData;
  oauthStates.delete(state as string);

  try {
    // Exchange code for access token using dynamic credentials
    const redirectUri = process.env.SLACK_REDIRECT_URI || `${req.protocol}://${req.get('host')}/auth/slack/callback`;
    
    const tokenResponse = await axios.post(SLACK_TOKEN_URL, null, {
      params: {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: code as string,
        redirect_uri: redirectUri
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokenData = tokenResponse.data;

    if (!tokenData.ok) {
      console.error('Token exchange failed:', tokenData.error);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    // Store user and tokens in database
    await dbRun(`
      INSERT OR REPLACE INTO users (
        slack_user_id, team_id, access_token, refresh_token, expires_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      tokenData.authed_user.id,
      tokenData.team.id,
      tokenData.access_token,
      tokenData.refresh_token || null,
      tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null
    ]);

    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?success=true&user_id=${tokenData.authed_user.id}`);

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=callback_failed`);
  }
});

// Check authentication status
router.get('/status/:userId', async (req, res) => {
  try {
    const user = await dbGet(
      'SELECT slack_user_id, team_id, expires_at FROM users WHERE slack_user_id = ?',
      [req.params.userId]
    );

    if (!user) {
      return res.status(404).json({ authenticated: false, error: 'User not found' });
    }

    // Check if token is expired (if expiration is set)
    const isExpired = user.expires_at && user.expires_at < Date.now();
    
    res.json({
      authenticated: !isExpired,
      userId: user.slack_user_id,
      teamId: user.team_id,
      expired: isExpired
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check authentication status' });
  }
});

export { router as authRoutes };
