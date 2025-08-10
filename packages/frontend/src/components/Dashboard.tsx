import React, { useState } from 'react';
import { MessageForm } from './MessageForm';
import { ScheduledMessages } from './ScheduledMessages';

interface DashboardProps {
  user: {
    id: string;
    teamId: string;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'scheduled'>('compose');

  return (
    <div className="dashboard">
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          📝 Compose Message
        </button>
        <button 
          className={`tab-button ${activeTab === 'scheduled' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduled')}
        >
          ⏰ Scheduled Messages
        </button>
      </div>

      {activeTab === 'compose' && <MessageForm userId={user.id} />}
      {activeTab === 'scheduled' && <ScheduledMessages userId={user.id} />}
    </div>
  );
};
