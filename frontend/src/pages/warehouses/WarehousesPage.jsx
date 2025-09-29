import React, { useState, useEffect } from 'react';
import { getToken } from '../../App';

function WarehousesPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ name: '', telephone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch warehouses from backend
  const fetchWarehouses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/warehouses', {
        headers: { 'Authorization': 'Bearer ' + getToken() }
      });
      if (!res.ok) throw new Error('Failed to fetch warehouses');
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: form.name,
        telephone: form.telephone,
        email: form.email
      };
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save warehouse');
      setForm({ name: '', telephone: '', email: '' });
      fetchWarehouses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🏬</div>
          <div className="header-text">
            <h1>Warehouse Management</h1>
            <p>Manage your business warehouses and locations</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{warehouses.length}</span>
            <span className="stat-label">Total Warehouses</span>
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

      {/* Add/Edit Warehouse Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{form.id ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
          <p className="card-subtitle">{form.id ? 'Update warehouse information' : 'Create a new warehouse'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Warehouse Name</label>
                <input
                  name="name"
                  placeholder="Enter warehouse name..."
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telephone</label>
                <input
                  name="telephone"
                  placeholder="Enter telephone..."
                  value={form.telephone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  placeholder="Enter email..."
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
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
                    {form.id ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span>{form.id ? '💾' : '➕'}</span>
                    {form.id ? 'Update Warehouse' : 'Add Warehouse'}
                  </>
                )}
              </button>
              {form.id && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setForm({ name: '', telephone: '', email: '', id: '' }); 
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

      {/* Warehouses List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Warehouses List</h2>
          <p className="card-subtitle">Manage existing warehouses</p>
        </div>
        <div className="card-content">
          {loading && warehouses.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading warehouses...</p>
            </div>
          ) : (
            <div className="item-list">
              {warehouses.map(w => (
                <div key={w.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{w.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{w.name}</h3>
                      <div className="item-meta-row">
                        <span>Tel: {w.telephone || '-'}</span> | <span>Email: {w.email || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setForm({ name: w.name, telephone: w.telephone, email: w.email, id: w.id });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={loading}
                      title="Edit warehouse"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={async () => {
                        if (window.confirm('Delete this warehouse?')) {
                          setLoading(true);
                          setError('');
                          try {
                            const res = await fetch(`/api/warehouses/${w.id}` , {
                              method: 'DELETE',
                              headers: { 'Authorization': 'Bearer ' + getToken() }
                            });
                            if (!res.ok) throw new Error('Failed to delete warehouse');
                            fetchWarehouses();
                          } catch (err) {
                            setError(err.message);
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      disabled={loading}
                      title="Delete warehouse"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {warehouses.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🏬</div>
                  <h3>No Warehouses Found</h3>
                  <p>Start by adding your first warehouse above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WarehousesPage;
