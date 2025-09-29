import React, { useState, useEffect } from 'react';

function LoginPage({ onLogin, message }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  // Show only 'Invalid Credentials' for known error
  useEffect(() => {
    if (message) {
      let msg = message;
      if (msg.includes('Invalid credentials')) msg = 'Invalid Credentials';
      setLocalMessage(msg);
      setFadeOut(false);
      // Start fade out after 2s, then remove after 2.5s
      const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
      const removeTimer = setTimeout(() => setLocalMessage(null), 2500);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      minHeight: '100vh', 
      minWidth: '100vw', 
      background: 'var(--color-gray-50)', 
      zIndex: 0 
    }}>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 'var(--spacing-6)'
      }}>
        <div className="card" style={{ 
          width: '100%',
          maxWidth: 400, 
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 'var(--spacing-8) var(--spacing-6) var(--spacing-6) var(--spacing-6)'
          }}>
            <div style={{
              width: 80,
              height: 80,
              backgroundColor: 'var(--color-primary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -56,
              marginBottom: 'var(--spacing-6)',
              boxShadow: 'var(--shadow-lg)',
              fontSize: 'var(--font-size-3xl)',
              color: 'var(--color-white)'
            }}>
              🔐
            </div>
            <h1 style={{ 
              marginBottom: 'var(--spacing-6)', 
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--color-gray-900)',
              textAlign: 'center'
            }}>
              Welcome to SOFEX
            </h1>
            <p style={{
              marginBottom: 'var(--spacing-8)',
              color: 'var(--color-gray-600)',
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)'
            }}>
              Sign in to your account to continue
            </p>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className={`btn btn-primary btn-lg ${loading ? 'disabled' : ''}`}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      {localMessage && (
        <div className="notification notification-error" style={{
          position: 'fixed',
          top: 'var(--spacing-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 400,
          zIndex: 2000,
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}>
          <span>❌</span>
          <span>{localMessage}</span>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
