import express from 'express';
import { WebClient } from '@slack/web-api';
import { dbGet } from '../database/init';

const router = express.Router();

// Get user's Slack client
async function getSlackClient(userId: string): Promise<WebClient> {
  const user = await dbGet(
    'SELECT access_token FROM users WHERE slack_user_id = ?',
    [userId]
  );

  if (!user) {
    throw new Error('User not found');
  }

  return new WebClient(user.access_token);
}

// Get channels list
router.get('/channels/:userId', async (req, res) => {
  try {
    const slack = await getSlackClient(req.params.userId);
    
    // Get public channels
    const channelsResponse = await slack.conversations.list({
      types: 'public_channel,private_channel',
      exclude_archived: true,
      limit: 100
    });

    // Get direct messages
    const dmsResponse = await slack.conversations.list({
      types: 'im',
      exclude_archived: true,
      limit: 100
    });

    const channels = channelsResponse.channels || [];
    const dms = dmsResponse.channels || [];

    // Get user info for DMs
    const dmChannels = await Promise.all(
      dms.map(async (dm: any) => {
        if (dm.user) {
          try {
            const userInfo = await slack.users.info({ user: dm.user });
            return {
              id: dm.id,
              name: `@${userInfo.user?.real_name || userInfo.user?.name || dm.user}`,
              is_channel: false,
              is_private: true
            };
          } catch (error) {
            return {
              id: dm.id,
              name: `@${dm.user}`,
              is_channel: false,
              is_private: true
            };
          }
        }
        return null;
      })
    );

    const allChannels = [
      ...channels.map((channel: any) => ({
        id: channel.id,
        name: `#${channel.name}`,
        is_channel: true,
        is_private: channel.is_private
      })),
      ...dmChannels.filter(Boolean)
    ];

    res.json({ channels: allChannels });

  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

// Send immediate message
router.post('/send', async (req, res) => {
  try {
    const { userId, channelId, message } = req.body;

    if (!userId || !channelId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const slack = await getSlackClient(userId);
    
    const result = await slack.chat.postMessage({
      channel: channelId,
      text: message
    });

    if (result.ok) {
      res.json({ 
        success: true, 
        timestamp: result.ts,
        channel: result.channel 
      });
    } else {
      res.status(400).json({ error: result.error || 'Failed to send message' });
    }

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export { router as messageRoutes };
