import React, { useState, useEffect } from 'react';
// Always get token inside each function for consistency
import useProviderTypes from './useProviderTypes';

function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({ id: '', name: '', providerTypeId: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { providerTypes, loading: loadingTypes } = useProviderTypes();

  // Fetch providers from backend
  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/providers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch providers');
      const data = await res.json();
      setProviders(data.sort((a, b) => a.id - b.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.providerTypeId) {
      setError('Provider type is required.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      const payload = {
        name: form.name,
        providerType: { id: Number(form.providerTypeId) },
      };
      if (editing) {
        res = await fetch(`/api/providers/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/providers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save provider');
      setForm({ id: '', name: '', providerTypeId: '' });
      setEditing(false);
      fetchProviders();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = provider => {
    setForm({
      id: provider.id,
      name: provider.name,
      providerTypeId: provider.providerType ? provider.providerType.id : '',
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/providers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete provider');
      if (String(form.id) === String(id)) {
        setForm({ id: '', name: '', providerTypeId: '' });
        setEditing(false);
        setSuccess('Provider deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
      await fetchProviders();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🏢</div>
          <div className="header-text">
            <h1>Provider Management</h1>
            <p>Manage your business providers and suppliers</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{providers.length}</span>
            <span className="stat-label">Total Providers</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="notification notification-error">
          <span>❌</span>
          <span>{error}</span>
          <button className="notification-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="notification notification-success">
          <span>✅</span>
          <span>{success}</span>
          <button className="notification-close" onClick={() => setSuccess('')}>×</button>
        </div>
      )}

      {/* Add/Edit Provider Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{editing ? 'Edit Provider' : 'Add New Provider'}</h2>
          <p className="card-subtitle">{editing ? 'Update provider information' : 'Create a new provider'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Provider Name</label>
              <input
                name="name"
                type="text"
                className="form-input"
                placeholder="Enter provider name..."
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Provider Type</label>
              <select
                name="providerTypeId"
                className="form-select"
                value={form.providerTypeId}
                onChange={handleChange}
                required
                disabled={loading || loadingTypes}
              >
                <option value="">Select provider type...</option>
                {providerTypes.filter(pt => pt.active).map(pt => (
                  <option key={pt.id} value={pt.id}>{pt.code} - {pt.providerType}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'disabled' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {editing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span>{editing ? '💾' : '➕'}</span>
                    {editing ? 'Update Provider' : 'Add Provider'}
                  </>
                )}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setForm({ id: '', name: '' }); 
                    setEditing(false); 
                    setError('');
                  }}
                  disabled={loading}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Providers List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Providers List</h2>
          <p className="card-subtitle">Manage existing providers</p>
        </div>
        <div className="card-content">
          {loading && providers.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading providers...</p>
            </div>
          ) : (
            <div className="item-list">
              {providers.map(provider => (
                <div key={provider.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{provider.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{provider.name}</h3>
                      <div className="item-meta">
                        <span>Type: {provider.providerType ? `${provider.providerType.code} - ${provider.providerType.providerType}` : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEdit(provider)}
                      disabled={loading}
                      title="Edit provider"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(provider.id)}
                      disabled={loading}
                      title="Delete provider"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {providers.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <h3>No Providers Found</h3>
                  <p>Start by adding your first provider above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProvidersPage;
