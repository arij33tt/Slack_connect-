import React, { useState } from 'react';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: { id: string; teamId: string }) => void;
}

export const AuthComponent: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleConnectSlack = async () => {
    setLoading(true);
    
    try {
      const response = await api.get('/auth/slack');
      
      if (response.data.authUrl) {
        // Redirect to Slack OAuth
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error: any) {
      console.error('Failed to initiate Slack OAuth:', error);
      setLoading(false);
      
      // Show error message to user
      alert(error.response?.data?.error || 'Failed to connect to Slack. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to Slack Connect</h2>
        <p>
          Connect your Slack workspace to start sending immediate and scheduled messages.
          You'll be redirected to Slack to authorize this application.
        </p>
        
        <button 
          className="connect-button" 
          onClick={handleConnectSlack}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              Connecting...
            </>
          ) : (
            <>
              🚀 Connect to Slack
            </>
          )}
        </button>
        
        <div style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          <p><strong>Required Permissions:</strong></p>
          <ul style={{ textAlign: 'left', paddingLeft: '1rem' }}>
            <li>Read channels and direct messages</li>
            <li>Send messages to channels</li>
            <li>View user information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
