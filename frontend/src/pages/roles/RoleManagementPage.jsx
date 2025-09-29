
import React, { useEffect, useState } from "react";
import "../../styles/design-system.css";

function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ id: '', name: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch roles');
      setRoles(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('Role name is required');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { name: form.name };
      let res;
      if (editing) {
        res = await fetch(`/api/roles/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to save role');
        setForm({ id: '', name: '' });
        setEditing(false);
      } else {
        res = await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to save role');
        setForm({ id: '', name: '' });
      }
      await fetchRoles();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = role => {
    setForm({ id: role.id, name: role.name });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete role');
      setForm({ id: '', name: '' });
      setEditing(false);
      fetchRoles();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🔑</div>
          <div className="header-text">
            <h1>Role Management</h1>
            <p>Manage user roles and permissions</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{roles.length}</span>
            <span className="stat-label">Total Roles</span>
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

      {/* Add/Edit Role Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{editing ? 'Edit Role' : 'Add New Role'}</h2>
          <p className="card-subtitle">{editing ? 'Update role information' : 'Create a new role'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Role Name</label>
                <input
                  name="name"
                  placeholder="Enter role name..."
                  value={form.name}
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
                    {editing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span>{editing ? '💾' : '➕'}</span>
                    {editing ? 'Update Role' : 'Add Role'}
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

      {/* Roles List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Roles List</h2>
          <p className="card-subtitle">Manage existing roles</p>
        </div>
        <div className="card-content">
          {loading && roles.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading roles...</p>
            </div>
          ) : (
            <div className="item-list">
              {roles.map(role => (
                <div key={role.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{role.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{role.name}</h3>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEdit(role)}
                      disabled={loading}
                      title="Edit role"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(role.id)}
                      disabled={loading}
                      title="Delete role"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {roles.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🔑</div>
                  <h3>No Roles Found</h3>
                  <p>Start by adding your first role above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleManagementPage;
