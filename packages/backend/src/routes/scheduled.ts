import express from 'express';
import { dbRun, dbGet, dbAll } from '../database/init';

const router = express.Router();

// Schedule a message
router.post('/schedule', async (req, res) => {
  try {
    const { userId, channelId, channelName, message, scheduledTime } = req.body;

    if (!userId || !channelId || !channelName || !message || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const scheduledTimestamp = new Date(scheduledTime).getTime();
    
    if (scheduledTimestamp <= Date.now()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    // Get user ID from database
    const user = await dbGet(
      'SELECT id FROM users WHERE slack_user_id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await dbRun(`
      INSERT INTO scheduled_messages (
        user_id, channel_id, channel_name, message, scheduled_time
      ) VALUES (?, ?, ?, ?, ?)
    `, [user.id, channelId, channelName, message, scheduledTimestamp]);

    res.json({
      success: true,
      messageId: result.lastID,
      scheduledTime: scheduledTimestamp
    });

  } catch (error) {
    console.error('Error scheduling message:', error);
    res.status(500).json({ error: 'Failed to schedule message' });
  }
});

// Get scheduled messages for a user
router.get('/list/:userId', async (req, res) => {
  try {
    const messages = await dbAll(`
      SELECT 
        sm.id,
        sm.channel_id,
        sm.channel_name,
        sm.message,
        sm.scheduled_time,
        sm.status,
        sm.created_at,
        sm.sent_at,
        sm.error_message
      FROM scheduled_messages sm
      JOIN users u ON sm.user_id = u.id
      WHERE u.slack_user_id = ? AND sm.status != 'cancelled'
      ORDER BY sm.scheduled_time ASC
    `, [req.params.userId]);

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      channelId: msg.channel_id,
      channelName: msg.channel_name,
      message: msg.message,
      scheduledTime: msg.scheduled_time,
      status: msg.status,
      createdAt: msg.created_at,
      sentAt: msg.sent_at,
      errorMessage: msg.error_message
    }));

    res.json({ messages: formattedMessages });

  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled messages' });
  }
});

// Cancel a scheduled message
router.delete('/cancel/:messageId', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const result = await dbRun(`
      UPDATE scheduled_messages 
      SET status = 'cancelled' 
      WHERE id = ? 
        AND user_id = (SELECT id FROM users WHERE slack_user_id = ?)
        AND status = 'pending'
    `, [req.params.messageId, userId]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Message not found or cannot be cancelled' });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error cancelling message:', error);
    res.status(500).json({ error: 'Failed to cancel message' });
  }
});

export { router as scheduledRoutes };
