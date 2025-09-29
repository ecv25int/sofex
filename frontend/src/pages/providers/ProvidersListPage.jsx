import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';
import { tableStyle, thStyle, tdStyle } from '../../styles/layout';

function ProvidersListPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch providers from backend
  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/providers', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch providers');
      const data = await res.json();
      setProviders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Providers List</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      
      {loading && <div>Loading providers...</div>}
      
      {!loading && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider.id}>
                <td style={tdStyle}>{provider.id}</td>
                <td style={tdStyle}>{provider.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {!loading && providers.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No providers found.
        </div>
      )}
    </div>
  );
}

export default ProvidersListPage;
