import React, { useEffect, useState } from "react";


function getCurrentUsername() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || payload.username || payload.user_name || null;
  } catch {
    return null;
  }
}

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: '', username: '', email: '', firstName: '', lastName: '', password: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUsername = getCurrentUsername();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const allUsers = await res.json();
      setUsers(allUsers.filter(user => user.username !== currentUsername));
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
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password
      };
      let res;
      if (editing) {
        res = await fetch(`/api/users/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save user');
      setForm({ id: '', username: '', email: '', firstName: '', lastName: '', password: '' });
      setEditing(false);
      fetchUsers();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = user => {
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: ''
    });
    setEditing(true);
  };

  const handleDelete = async id => {
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userToDelete = users.find(u => u.id === id);
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setForm({ id: '', username: '', email: '', firstName: '', lastName: '', password: '' });
      setEditing(false);
      if (userToDelete && userToDelete.username === currentUsername) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      fetchUsers();
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
          <div className="header-icon">👤</div>
          <div className="header-text">
            <h1>User Management</h1>
            <p>Manage your application's users and access</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
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

      {/* Add/Edit User Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">{editing ? 'Edit User' : 'Add New User'}</h2>
          <p className="card-subtitle">{editing ? 'Update user information' : 'Create a new user'}</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  name="username"
                  placeholder="Enter username..."
                  value={form.username}
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
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  name="firstName"
                  placeholder="Enter first name..."
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  name="lastName"
                  placeholder="Enter last name..."
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder={editing ? "New Password (optional)" : "Password"}
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  required={!editing}
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
                    {editing ? 'Update User' : 'Add User'}
                  </>
                )}
              </button>
              {editing && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setForm({ id: '', username: '', email: '', firstName: '', lastName: '', password: '' }); 
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

      {/* Users List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Users List</h2>
          <p className="card-subtitle">Manage existing users</p>
        </div>
        <div className="card-content">
          {loading && users.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="item-list">
              {users.map(user => (
                <div key={user.id} className="list-item">
                  <div className="item-content">
                    <span className="item-number">#{user.id}</span>
                    <div className="item-details">
                      <h3 className="item-title">{user.username}</h3>
                      <div className="item-meta-row">
                        <span>Email: {user.email}</span> | <span>Name: {user.firstName} {user.lastName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                      title="Edit user"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                      title="Delete user"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">👤</div>
                  <h3>No Users Found</h3>
                  <p>Start by adding your first user above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage;
