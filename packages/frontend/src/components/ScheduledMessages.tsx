import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

interface ScheduledMessage {
  id: number;
  channelId: string;
  channelName: string;
  message: string;
  scheduledTime: number;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  createdAt: string;
  sentAt?: string;
  errorMessage?: string;
}

interface ScheduledMessagesProps {
  userId: string;
}

export const ScheduledMessages: React.FC<ScheduledMessagesProps> = ({ userId }) => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScheduledMessages();
    
    // Refresh every 30 seconds to show updated statuses
    const interval = setInterval(loadScheduledMessages, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  const loadScheduledMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/scheduled/list/${userId}`);
      setMessages(response.data.messages);
    } catch (error: any) {
      console.error('Failed to load scheduled messages:', error);
      toast.error('Failed to load scheduled messages');
    } finally {
      setLoading(false);
    }
  };

  const cancelMessage = async (messageId: number) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled message?')) {
      return;
    }

    try {
      await api.delete(`/api/scheduled/cancel/${messageId}`, {
        data: { userId }
      });
      
      toast.success('Message cancelled successfully');
      loadScheduledMessages(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to cancel message:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel message');
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      sent: 'status-sent',
      failed: 'status-failed',
      cancelled: 'status-failed'
    };

    return (
      <span className={`message-status ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const isPastDue = (scheduledTime: number) => {
    return scheduledTime < Date.now();
  };

  if (loading && messages.length === 0) {
    return (
      <div className="scheduled-messages">
        <h3>Scheduled Messages</h3>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduled-messages">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Scheduled Messages</h3>
        <button 
          className="btn btn-primary"
          onClick={loadScheduledMessages}
          disabled={loading}
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>📅 No scheduled messages</p>
          <small>Messages you schedule will appear here</small>
        </div>
      ) : (
        <div className="message-list">
          {messages.map(message => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <div>
                  <div className="message-channel">{message.channelName}</div>
                  <div className="message-time">
                    Scheduled for: {formatDateTime(message.scheduledTime)}
                    {isPastDue(message.scheduledTime) && message.status === 'pending' && (
                      <span style={{ color: '#FFC107', marginLeft: '0.5rem' }}>
                        (Processing...)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="message-content">
                {message.message}
              </div>

              <div className="message-actions">
                <div>
                  {getStatusBadge(message.status)}
                  {message.status === 'sent' && message.sentAt && (
                    <small style={{ marginLeft: '1rem', opacity: 0.8 }}>
                      Sent: {formatDateTime(new Date(message.sentAt).getTime())}
                    </small>
                  )}
                  {message.status === 'failed' && message.errorMessage && (
                    <small style={{ marginLeft: '1rem', color: '#dc3545' }}>
                      Error: {message.errorMessage}
                    </small>
                  )}
                </div>

                {message.status === 'pending' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelMessage(message.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
