import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: { id: string; teamId: string }) => void;
}

export const AuthComponent: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({
    clientId: '',
    clientSecret: '',
    signingSecret: ''
  });

  const handleConnectSlack = async () => {
    if (!showCredentials) {
      setShowCredentials(true);
      return;
    }

    if (!credentials.clientId || !credentials.clientSecret) {
      toast.error('Please fill in your Slack app Client ID and Client Secret');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/auth/slack', {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        signingSecret: credentials.signingSecret
      });
      
      if (response.data.authUrl) {
        // Store credentials in session for the callback
        sessionStorage.setItem('slack_credentials', JSON.stringify(credentials));
        // Redirect to Slack OAuth
        window.location.href = response.data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error: any) {
      console.error('Failed to initiate Slack OAuth:', error);
      setLoading(false);
      
      toast.error(error.response?.data?.error || 'Failed to connect to Slack. Please check your credentials and try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to Slack Connect</h2>
        {!showCredentials ? (
          <>
            <p>
              Connect your Slack workspace to start sending immediate and scheduled messages.
              You'll need to provide your Slack app credentials first.
            </p>
            
            <button 
              className="connect-button" 
              onClick={handleConnectSlack}
              disabled={loading}
            >
              📋 Enter Slack App Credentials
            </button>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#08090aff', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p><strong>Don't have a Slack app yet?</strong></p>
              <ol style={{ textAlign: 'left', paddingLeft: '1rem', margin: '0.5rem 0' }}>
                <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer">api.slack.com/apps</a></li>
                <li>Click "Create New App" → "From scratch"</li>
                <li>Name your app and select your workspace</li>
                <li>Go to "OAuth & Permissions" and add Bot Token Scopes:
                  <ul style={{ marginTop: '0.5rem' }}>
                    <li>channels:read</li>
                    <li>chat:write</li>
                    <li>groups:read</li>
                    <li>im:read</li>
                    <li>mpim:read</li>
                  </ul>
                </li>
                <li>Copy your Client ID and Client Secret from "Basic Information"</li>
              </ol>
            </div>
          </>
        ) : (
          <>
            <p>
              Enter your Slack app credentials. You can find these in your Slack app's "Basic Information" page.
            </p>
            
            <div className="credentials-form">
              <div className="form-group">
                <label htmlFor="clientId">Client ID <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="text"
                  id="clientId"
                  value={credentials.clientId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                  placeholder="123456789.123456789"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="clientSecret">Client Secret <span style={{ color: 'red' }}>*</span></label>
                <input
                  type="password"
                  id="clientSecret"
                  value={credentials.clientSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                  placeholder="abcd1234efgh5678..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="signingSecret">Signing Secret (Optional)</label>
                <input
                  type="password"
                  id="signingSecret"
                  value={credentials.signingSecret}
                  onChange={(e) => setCredentials(prev => ({ ...prev, signingSecret: e.target.value }))}
                  placeholder="abcd1234efgh5678..."
                />
                <small style={{ opacity: 0.7 }}>Used for webhook verification (optional for basic messaging)</small>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCredentials(false)}
                disabled={loading}
              >
                ← Back
              </button>
              
              <button 
                className="connect-button" 
                onClick={handleConnectSlack}
                disabled={loading || !credentials.clientId || !credentials.clientSecret}
                style={{ flex: 1 }}
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
            </div>
          </>
        )}
        
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
