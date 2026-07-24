import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import API from './api/axios';
import { Server, Database, CheckCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';

function App() {
  const [apiStatus, setApiStatus] = useState({ loading: true, success: false, data: null, error: null });

  const checkApiHealth = async () => {
    setApiStatus({ loading: true, success: false, data: null, error: null });
    try {
      const response = await API.get('/health');
      setApiStatus({ loading: false, success: true, data: response.data, error: null });
    } catch (err) {
      setApiStatus({ loading: false, success: false, data: null, error: err.message });
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
          <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-color)',
              marginBottom: '1rem'
            }}>
              <Layers size={36} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Welcome to ConnectHub
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
              Production-Grade Full Stack MERN Social Media Platform built with Node.js, Express, MongoDB, and React (Vite).
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 500,
              border: '1px solid var(--border-color)'
            }}>
              <span className="status-dot online"></span>
              <span>Module 1: Architecture & Foundations Ready</span>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={18} color="var(--accent-color)" /> Backend System Status
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={checkApiHealth} disabled={apiStatus.loading}>
                <RefreshCw size={14} className={apiStatus.loading ? 'spin-animation' : ''} /> Check API
              </button>
            </div>

            {apiStatus.loading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Connecting to REST API...</p>
            ) : apiStatus.success ? (
              <div style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success-color)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <CheckCircle size={18} />
                <div>
                  <strong>{apiStatus.data.message}</strong>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.2rem' }}>
                    Server Timestamp: {new Date(apiStatus.data.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger-color)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <AlertCircle size={18} />
                <div>
                  <strong>API Connection Error:</strong> {apiStatus.error}
                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    Make sure the Express backend server is running on port 5000 (`npm run dev` in backend directory).
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
