import React, { useEffect, useState } from 'react';

function ProviderTypePage() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ code: '', providerType: '', active: true });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper to get JWT token from localStorage
  function getAuthToken() {
    return localStorage.getItem('token');
  }

  const fetchTypes = async () => {
    try {
      const res = await fetch('/api/provider-types', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch provider types');
      setTypes(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { fetchTypes(); }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/provider-types/${editing}` : '/api/provider-types';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save provider type');
      setForm({ code: '', providerType: '', active: true });
      setEditing(null);
      setSuccess('Saved!');
      fetchTypes();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = t => {
    setForm({ code: t.code, providerType: t.providerType, active: t.active });
    setEditing(t.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this provider type?')) return;
    try {
      const res = await fetch(`/api/provider-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🏷️</div>
          <div className="header-text">
            <h1>Provider Types</h1>
            <p>Manage provider type definitions</p>
          </div>
        </div>
      </div>
      {error && <div className="notification notification-error">{error}</div>}
      {success && <div className="notification notification-success">{success}</div>}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <h2>{editing ? 'Edit Provider Type' : 'Add Provider Type'}</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input name="code" value={form.code} onChange={handleChange} placeholder="Code" required className="form-input" style={{ minWidth: 120 }} />
            <input name="providerType" value={form.providerType} onChange={handleChange} placeholder="Description" required className="form-input" style={{ minWidth: 180 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /> Active
            </label>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm({ code: '', providerType: '', active: true }); }}>Cancel</button>}
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h2>Provider Types List</h2></div>
        <div className="card-content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Description</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.code}</td>
                  <td>{t.providerType}</td>
                  <td>{t.active ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(t.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {types.length === 0 && <tr><td colSpan={5}>No provider types found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProviderTypePage;
