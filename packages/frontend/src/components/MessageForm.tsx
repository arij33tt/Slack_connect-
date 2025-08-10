import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

interface Channel {
  id: string;
  name: string;
  is_channel: boolean;
  is_private: boolean;
}

interface MessageFormProps {
  userId: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({ userId }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [messageType, setMessageType] = useState<'immediate' | 'scheduled'>('immediate');
  const [loading, setLoading] = useState(false);
  const [channelsLoading, setChannelsLoading] = useState(false);

  const loadChannels = useCallback(async () => {
    setChannelsLoading(true);
    try {
      const response = await api.get(`/api/messages/channels/${userId}`);
      setChannels(response.data.channels);
    } catch (error: any) {
      console.error('Failed to load channels:', error);
      toast.error('Failed to load channels');
    } finally {
      setChannelsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChannel || !message.trim()) {
      toast.error('Please select a channel and enter a message');
      return;
    }

    if (messageType === 'scheduled' && !scheduledTime) {
      toast.error('Please select a scheduled time');
      return;
    }

    if (messageType === 'scheduled' && new Date(scheduledTime) <= new Date()) {
      toast.error('Scheduled time must be in the future');
      return;
    }

    setLoading(true);

    try {
      if (messageType === 'immediate') {
        await sendImmediateMessage();
      } else {
        await scheduleMessage();
      }
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const sendImmediateMessage = async () => {
    const response = await api.post('/api/messages/send', {
      userId,
      channelId: selectedChannel,
      message
    });

    if (response.data.success) {
      toast.success('Message sent successfully!');
      setMessage('');
    }
  };

  const scheduleMessage = async () => {
    const selectedChannelObj = channels.find(ch => ch.id === selectedChannel);
    
    const response = await api.post('/api/scheduled/schedule', {
      userId,
      channelId: selectedChannel,
      channelName: selectedChannelObj?.name || 'Unknown Channel',
      message,
      scheduledTime
    });

    if (response.data.success) {
      toast.success('Message scheduled successfully!');
      setMessage('');
      setScheduledTime('');
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    // Add 1 minute to current time to ensure it's in the future
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  return (
    <div className="message-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Message Type</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="immediate"
                checked={messageType === 'immediate'}
                onChange={(e) => setMessageType(e.target.value as 'immediate')}
              />
              Send Immediately
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                value="scheduled"
                checked={messageType === 'scheduled'}
                onChange={(e) => setMessageType(e.target.value as 'scheduled')}
              />
              Schedule for Later
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="channel">Select Channel</label>
          <select
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            disabled={channelsLoading}
            required
          >
            <option value="">
              {channelsLoading ? 'Loading channels...' : 'Select a channel'}
            </option>
            {channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            required
          />
        </div>

        {messageType === 'scheduled' && (
          <div className="form-group">
            <label htmlFor="scheduledTime">Scheduled Time</label>
            <input
              type="datetime-local"
              id="scheduledTime"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              min={getMinDateTime()}
              required
            />
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className={`btn ${messageType === 'immediate' ? 'btn-success' : 'btn-primary'}`}
            disabled={loading || channelsLoading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                {messageType === 'immediate' ? 'Sending...' : 'Scheduling...'}
              </>
            ) : (
              messageType === 'immediate' ? '🚀 Send Now' : '⏰ Schedule Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
