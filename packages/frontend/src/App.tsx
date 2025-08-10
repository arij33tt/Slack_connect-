import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthComponent } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { api } from './services/api';
import './App.css';

interface User {
  id: string;
  teamId: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const userId = urlParams.get('user_id');
    const error = urlParams.get('error');

    if (success && userId) {
      setUser({ id: userId, teamId: '' });
      toast.success('Successfully connected to Slack!');
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    } else if (error) {
      toast.error(`Authentication failed: ${error}`);
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    }

    // Check if user is already authenticated
    const savedUserId = localStorage.getItem('slack_user_id');
    if (savedUserId && !user) {
      checkAuthStatus(savedUserId);
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkAuthStatus = async (userId: string) => {
    try {
      const response = await api.get(`/auth/status/${userId}`);
      if (response.data.authenticated) {
        setUser({ id: response.data.userId, teamId: response.data.teamId });
      } else {
        localStorage.removeItem('slack_user_id');
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      localStorage.removeItem('slack_user_id');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('slack_user_id', userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('slack_user_id');
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Slack Connect</h1>
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
      
      <main className="app-main">
        {user ? (
          <Dashboard user={user} />
        ) : (
          <AuthComponent onLogin={handleLogin} />
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
