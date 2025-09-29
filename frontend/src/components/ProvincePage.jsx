import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProvincePage = ({ user }) => {
  const [provinces, setProvinces] = useState([]);
  const [newProvince, setNewProvince] = useState('');
  const [editingProvince, setEditingProvince] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if user is admin
  const isAdmin = user && user.roles && user.roles.includes('ADMIN');

  useEffect(() => {
    if (isAdmin) {
      loadProvinces();
    }
  }, [isAdmin]);

  const loadProvinces = async () => {
    try {
      setLoading(true);
  const response = await axios.get('/api/provinces', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Sort provinces by ID in ascending order
      const sortedProvinces = response.data.sort((a, b) => a.id - b.id);
      setProvinces(sortedProvinces);
    } catch (error) {
      setError('Error loading provinces');
      console.error('Error loading provinces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newProvince.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      await axios.post('/api/provinces', 
        { name: newProvince },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setNewProvince('');
      setSuccess('Province added successfully!');
      loadProvinces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error adding province');
      console.error('Error adding province:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (province) => {
    setEditingProvince(province.id);
    setEditName(province.name);
    setError('');
    setSuccess('');
  };

  const handleUpdate = async () => {
    if (!editName.trim()) return;
    
    try {
      setLoading(true);
      setError('');
  await axios.put(`/api/provinces/${editingProvince}`, 
        { name: editName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setEditingProvince(null);
      setEditName('');
      setSuccess('Province updated successfully!');
      loadProvinces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error updating province');
      console.error('Error updating province:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, provinceName) => {
    if (!window.confirm(`Are you sure you want to delete "${provinceName}"? This will also delete all associated cantons and districts.`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
  await axios.delete(`/api/provinces/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Province deleted successfully!');
      loadProvinces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error deleting province');
      console.error('Error deleting province:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingProvince(null);
    setEditName('');
    setError('');
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page. Admin role is required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">🗺️</div>
          <div className="header-text">
            <h1>Province Management</h1>
            <p>Manage Costa Rica's administrative provinces</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stat">
            <span className="stat-number">{provinces.length}</span>
            <span className="stat-label">Total Provinces</span>
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

      {/* Add New Province Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Add New Province</h2>
          <p className="card-subtitle">Create a new administrative province</p>
        </div>
        <div className="card-content">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter province name..."
              value={newProvince}
              onChange={(e) => setNewProvince(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && newProvince.trim() && handleAdd()}
              disabled={loading}
            />
          </div>
          <button 
            className={`btn btn-primary ${loading || !newProvince.trim() ? 'disabled' : ''}`}
            onClick={handleAdd}
            disabled={loading || !newProvince.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <span>➕</span>
                Add Province
              </>
            )}
          </button>
        </div>
      </div>

      {/* Provinces List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Provinces List</h2>
          <p className="card-subtitle">Manage existing provinces</p>
        </div>
        <div className="card-content">
          {loading && provinces.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading provinces...</p>
            </div>
          ) : (
            <div className="item-list">
              {provinces.map(province => (
                <div key={province.id} className="list-item">
                  <div className="item-content">
                    {editingProvince === province.id ? (
                      <div className="form-group" style={{ margin: 0, flex: 1 }}>
                        <input
                          type="text"
                          className="form-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                          disabled={loading}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <>
                        <span className="item-number">#{province.id}</span>
                        <div className="item-details">
                          <h3 className="item-title">{province.name}</h3>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="item-actions">
                    {editingProvince === province.id ? (
                      <>
                        <button
                          className={`btn btn-success btn-sm ${loading || !editName.trim() ? 'disabled' : ''}`}
                          onClick={handleUpdate}
                          disabled={loading || !editName.trim()}
                        >
                          {loading ? <span className="loading-spinner"></span> : '💾'} Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEdit(province)}
                          disabled={loading}
                          title="Edit province"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(province.id, province.name)}
                          disabled={loading}
                          title="Delete province"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              {provinces.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <h3>No Provinces Found</h3>
                  <p>Start by adding your first province above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvincePage;
