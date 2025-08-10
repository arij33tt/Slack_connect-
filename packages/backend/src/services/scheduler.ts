import cron from 'node-cron';
import { WebClient } from '@slack/web-api';
import { dbAll, dbRun } from '../database/init';

// Run every minute to check for scheduled messages
const CRON_SCHEDULE = '* * * * *';

export function startScheduler(): void {
  console.log('Starting message scheduler with cron schedule:', CRON_SCHEDULE);
  
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('Scheduler tick at:', new Date().toISOString());
    await processScheduledMessages();
  }, {
    scheduled: true,
    timezone: "UTC"
  });
  
  console.log('Message scheduler started successfully');
}

async function processScheduledMessages(): Promise<void> {
  try {
    // Get messages that should be sent now
    const currentTime = Date.now();
    const messagesToSend = await dbAll(`
      SELECT 
        sm.id,
        sm.channel_id,
        sm.message,
        sm.scheduled_time,
        u.access_token,
        u.slack_user_id
      FROM scheduled_messages sm
      JOIN users u ON sm.user_id = u.id
      WHERE sm.status = 'pending' 
        AND sm.scheduled_time <= ?
      ORDER BY sm.scheduled_time ASC
    `, [currentTime]);

    if (messagesToSend.length === 0) {
      // Uncomment for verbose logging
      // console.log('No messages to send at', new Date().toISOString());
      return;
    }

    console.log(`Processing ${messagesToSend.length} scheduled messages...`);

    for (const message of messagesToSend) {
      try {
        // Create Slack client for this user
        const slack = new WebClient(message.access_token);

        // Send the message
        const result = await slack.chat.postMessage({
          channel: message.channel_id,
          text: message.message
        });

        if (result.ok) {
          // Mark as sent
          await dbRun(`
            UPDATE scheduled_messages 
            SET status = 'sent', sent_at = CURRENT_TIMESTAMP 
            WHERE id = ?
          `, [message.id]);

          console.log(`Successfully sent scheduled message ${message.id}`);
        } else {
          // Mark as failed
          await dbRun(`
            UPDATE scheduled_messages 
            SET status = 'failed', error_message = ? 
            WHERE id = ?
          `, [result.error || 'Unknown error', message.id]);

          console.error(`Failed to send message ${message.id}: ${result.error}`);
        }

      } catch (error) {
        // Mark as failed
        await dbRun(`
          UPDATE scheduled_messages 
          SET status = 'failed', error_message = ? 
          WHERE id = ?
        `, [error instanceof Error ? error.message : 'Unknown error', message.id]);

        console.error(`Error sending message ${message.id}:`, error);
      }
    }

  } catch (error) {
    console.error('Error processing scheduled messages:', error);
  }
}
